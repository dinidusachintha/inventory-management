const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");

// Route to add a new item
router.post("/add", itemController.addItem);

// Route to get all items
router.get("/", itemController.getAllItems);

// Route to get a single item by ID
router.get("/:id", itemController.getItemById);

// Route to update an item
router.put("/:id", itemController.updateItem);

// Route to delete an item
router.delete("/:id", itemController.deleteItem);

module.exports = router;
