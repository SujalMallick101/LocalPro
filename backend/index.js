const express=require("express")
const dotenv=require("dotenv")
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config()

const app=express()

//Middlewares
app.use(cors())
app.use(express.json())

//Connect to DB
connectDB()

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));