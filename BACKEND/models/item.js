const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  category: {
    type: String,
    required: true,
    enum: ['Groceries', 'Electronics', 'Cleaning', 'Other'],
    default: 'Other'
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    max: 1000
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    validate: {
      validator: function(value) {
        return !value || value > this.purchaseDate;
      },
      message: 'Expiry date must be later than purchase date'
    }
  },
  image: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for image URL
itemSchema.virtual('imageUrl').get(function() {
  if (!this.image) return null;
  return `${process.env.BASE_URL || 'http://localhost:8090'}/${this.image}`;
});

module.exports = mongoose.model('Item', itemSchema);