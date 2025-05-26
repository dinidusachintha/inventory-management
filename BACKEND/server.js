const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8090;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const URL = "mongodb+srv://admin:pwOWsxzSgwnAIv78@cluster0.81pbs.mongodb.net/yourDatabaseName?retryWrites=true&w=majority";

mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.error("MongoDB Connection Failed:", err));

// Routes
const itemRouter = require("./routes/items");
app.use("/item", itemRouter); // Correct route to match frontend URL

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
