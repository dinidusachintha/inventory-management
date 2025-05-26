const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  // Removed petId field to prevent duplicate key errors
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    validate: {
      validator: function(value) {
        // Only validate if expiryDate is provided. It must be later than purchaseDate.
        return !value || value > this.purchaseDate;
      },
      message: "Expiry date must be later than purchase date"
    }
  }
});

module.exports = mongoose.model("Item", itemSchema);
