import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function CreateItem() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [updatedItem, setUpdatedItem] = useState({ name: "", category: "", quantity: "" });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get("http://localhost:8090/item/");
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching data!", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8090/item/${id}`);
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleUpdate = (item) => {
    setSelectedItem(item);
    setUpdatedItem({ name: item.name, category: item.category, quantity: item.quantity });
  };

  const handleUpdateSubmit = async () => {
    try {
      await axios.put(`http://localhost:8090/item/${selectedItem._id}`, updatedItem);
      setSelectedItem(null);
      fetchItems();
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Item List Report", 20, 20);
    let y = 40;
    
    items.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.name} - ${item.category} - Qty: ${item.quantity}`, 20, y);
      y += 10;
    });
    
    doc.save("item_report.pdf");
  };

  const filteredItems = items.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const chartData = {
    labels: filteredItems.map(item => item.name),
    datasets: [{ label: "Quantity", data: filteredItems.map(item => item.quantity), backgroundColor: "rgba(75, 192, 192, 0.5)", borderColor: "rgba(75, 192, 192, 1)", borderWidth: 1 }]
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Item List</h2>
      <input type="text" placeholder="Search by item name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: "8px", width: "100%", marginBottom: "10px" }} />
      <button onClick={generatePDF} style={{ backgroundColor: "#007bff", color: "white", padding: "8px 15px", border: "none", borderRadius: "5px", cursor: "pointer", marginBottom: "10px" }}>Generate Report</button>
      
      {selectedItem && (
        <div style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
          <h3>Update Item</h3>
          <input type="text" value={updatedItem.name} onChange={(e) => setUpdatedItem({ ...updatedItem, name: e.target.value })} placeholder="Name" style={{ display: "block", marginBottom: "10px" }} />
          <input type="text" value={updatedItem.category} onChange={(e) => setUpdatedItem({ ...updatedItem, category: e.target.value })} placeholder="Category" style={{ display: "block", marginBottom: "10px" }} />
          <input type="number" value={updatedItem.quantity} onChange={(e) => setUpdatedItem({ ...updatedItem, quantity: e.target.value })} placeholder="Quantity" style={{ display: "block", marginBottom: "10px" }} />
          <button onClick={handleUpdateSubmit} style={{ backgroundColor: "#28a745", color: "white", padding: "5px 10px", border: "none", borderRadius: "5px", cursor: "pointer" }}>Save</button>
          <button onClick={() => setSelectedItem(null)} style={{ marginLeft: "10px", backgroundColor: "#dc3545", color: "white", padding: "5px 10px", border: "none", borderRadius: "5px", cursor: "pointer" }}>Cancel</button>
        </div>
      )}
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th>Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr key={item._id} style={{ borderBottom: "1px solid #ddd" }}>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.quantity}</td>
              <td>
                <button onClick={() => handleUpdate(item)} style={{ backgroundColor: "#ffc107", color: "black", padding: "5px", margin: "5px", border: "none", cursor: "pointer" }}>Update</button>
                <button onClick={() => handleDelete(item._id)} style={{ backgroundColor: "#dc3545", color: "white", padding: "5px", margin: "5px", border: "none", cursor: "pointer" }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: "30px" }}>
        <Bar data={chartData} />
      </div>
    </div>
  );
}
