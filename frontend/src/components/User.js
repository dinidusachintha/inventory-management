import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ItemList() {
  const [items, setItems] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");

  // Fetch all items when the component mounts
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get("http://localhost:8090/item");
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
      setAlertMessage("Failed to fetch items. Please try again.");
      setTimeout(() => setAlertMessage(""), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`http://localhost:8090/item/${id}`);
        setAlertMessage("Item deleted successfully!");
        setTimeout(() => setAlertMessage(""), 3000);
        fetchItems(); // Refresh the item list
      } catch (error) {
        console.error("Error deleting item:", error);
        setAlertMessage("Failed to delete item. Please try again.");
        setTimeout(() => setAlertMessage(""), 3000);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Item List</h2>

      {/* Alert message for success or error */}
      {alertMessage && (
        <div className={`alert ${alertMessage.includes("Failed") ? "alert-danger" : "alert-success"}`}>
          {alertMessage}
        </div>
      )}

   
      
      {/* Items table */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Purchase Date</th>
            <th>Expiry Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No items found
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.quantity}</td>
                <td>{new Date(item.purchaseDate).toLocaleDateString()}</td>
                <td>{item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : "N/A"}</td>
                
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}