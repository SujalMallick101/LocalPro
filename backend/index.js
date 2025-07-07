const express=require("express")
const dotenv=require("dotenv")
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const serviceRoutes=require("./routes/serviceRoutes");
const bookingRoutes=require('./routes/bookingRoutes');

dotenv.config()

const app=express()

//Middlewares
app.use(cors())
app.use(express.json())

//Connect to DB
connectDB()

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/services",serviceRoutes)
app.use("/api/bookings",bookingRoutes)

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));