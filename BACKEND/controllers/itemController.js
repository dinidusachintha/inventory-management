const Item = require("../models/item");

// Add a new item
exports.addItem = async (req, res) => {
  try {
    const { name, category, quantity, purchaseDate, expiryDate } = req.body;
    const newItem = new Item({
      name,
      category,
      quantity,
      purchaseDate: purchaseDate ? new Date(purchaseDate) : undefined,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined
    });
    await newItem.save();
    res.status(201).json({ message: "Item added successfully", item: newItem });
  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).json({ message: "Error adding item", error: error.message });
  }
};

// Get all items
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Error fetching items", error: error.message });
  }
};

// Get a single item by ID
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    console.error("Error fetching item:", error);
    res.status(500).json({ message: "Error fetching item", error: error.message });
  }
};

// Update an item
exports.updateItem = async (req, res) => {
  try {
    const { name, category, quantity, purchaseDate, expiryDate } = req.body;
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { name, category, quantity, purchaseDate, expiryDate },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item updated successfully", item: updatedItem });
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ message: "Error updating item", error: error.message });
  }
};

// Delete an item
exports.deleteItem = async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ message: "Error deleting item", error: error.message });
  }
};
