const multer = require('multer');
const path = require('path');
const Item = require('../models/item');
const fs = require('fs');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'item-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Add item with image
exports.addItem = async (req, res) => {
  try {
    const { name, category, quantity, purchaseDate, expiryDate } = req.body;
    
    const newItem = new Item({
      name,
      category,
      quantity: parseInt(quantity),
      purchaseDate: purchaseDate ? new Date(purchaseDate) : new Date(),
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      image: req.file ? req.file.path : null
    });

    await newItem.save();
    res.status(201).json({ 
      message: "Item added successfully", 
      item: newItem 
    });
  } catch (error) {
    console.error("Error adding item:", error);
    // Delete uploaded file if error occurred
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }
    res.status(500).json({ 
      message: "Error adding item", 
      error: error.message 
    });
  }
};

// Get all items with image URLs
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    // Map items to include full image URL
    const itemsWithUrls = items.map(item => ({
      ...item.toObject(),
      imageUrl: item.image ? `${req.protocol}://${req.get('host')}/${item.image}` : null
    }));
    res.status(200).json(itemsWithUrls);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ 
      message: "Error fetching items", 
      error: error.message 
    });
  }
};

// Other controller methods (getById, update, delete) remain similar
// but should handle image updates/deletion as well

exports.upload = upload;