import React, { useState } from "react";
import axios from "axios";

export default function AddItem({ onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: 1,
    purchaseDate: new Date().toISOString().split('T')[0],
    expiryDate: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "image") {
      setFormData(prev => ({ ...prev, image: files[0] }));
      if (files[0]) {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(files[0]);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.name || !formData.category || formData.quantity < 1) {
      setAlertMessage("Please fill all required fields!");
      setTimeout(() => setAlertMessage(""), 3000);
      setIsSubmitting(false);
      return;
    }

    if (formData.expiryDate && formData.expiryDate <= formData.purchaseDate) {
      setAlertMessage("Expiry date must be later than purchase date!");
      setTimeout(() => setAlertMessage(""), 3000);
      setIsSubmitting(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("category", formData.category);
      data.append("quantity", formData.quantity);
      data.append("purchaseDate", formData.purchaseDate);
      if (formData.expiryDate) data.append("expiryDate", formData.expiryDate);
      if (formData.image) data.append("image", formData.image);

      const response = await axios.post("http://localhost:8090/item/add", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setAlertMessage("Item added successfully!");
      setTimeout(() => setAlertMessage(""), 3000);
      setFormData({
        name: "",
        category: "",
        quantity: 1,
        purchaseDate: new Date().toISOString().split('T')[0],
        expiryDate: "",
        image: null,
      });
      setImagePreview(null);
      onSave();
    } catch (error) {
      console.error("Error adding item:", error);
      setAlertMessage(error.response?.data?.message || "Failed to add item. Please try again.");
      setTimeout(() => setAlertMessage(""), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Add New Item</h2>

      {alertMessage && (
        <div className={`alert ${alertMessage.includes("successfully") ? "alert-success" : "alert-danger"}`}>
          {alertMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="name">Item Name*</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group mt-3">
              <label htmlFor="category">Category*</label>
              <select
                className="form-control"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                <option value="Groceries">Groceries</option>
                <option value="Electronics">Electronics</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group mt-3">
              <label htmlFor="quantity">Quantity*</label>
              <input
                type="number"
                className="form-control"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                required
              />
            </div>

            <div className="form-group mt-3">
              <label htmlFor="purchaseDate">Purchase Date*</label>
              <input
                type="date"
                className="form-control"
                id="purchaseDate"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group mt-3">
              <label htmlFor="expiryDate">Expiry Date</label>
              <input
                type="date"
                className="form-control"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                min={formData.purchaseDate}
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="image">Item Image</label>
              <input
                type="file"
                className="form-control"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleChange}
              />
              <small className="text-muted">Max size: 5MB (JPEG, PNG)</small>
            </div>

            {imagePreview && (
              <div className="mt-3">
                <h6>Image Preview:</h6>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="img-thumbnail"
                  style={{ maxWidth: '100%', maxHeight: '300px' }} 
                />
                <button
                  type="button"
                  className="btn btn-sm btn-danger mt-2"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, image: null }));
                    setImagePreview(null);
                  }}
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary mt-4"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding...' : 'Add Item'}
        </button>
      </form>
    </div>
  );
}