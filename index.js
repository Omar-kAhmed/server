require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connection = require("./db");
const UserRoutes = require("./routes/users");
const AuthRoutes = require("./routes/auth");
const { User } = require("./models/user");
const path = require('path');
const diyRoutes = require('./routes/diy'); // Import the diyRoutes file
const usedCarPriceRoutes = require('./routes/usedCarPrice'); // Import the usedCarPrice route
const maintenanceRoutes = require("./routes/maintenance");

const app = express();

// Connect to the database
connection();

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_ORIGIN, // Ensure this matches your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));


// Routes
app.use("/api/users", UserRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/used-car-price", usedCarPriceRoutes);  // Used car price routes
app.use("/", diyRoutes);  // DIY routes

// Static folder for local videos
app.use('/videos', express.static(path.join(__dirname, 'videos')));

// Test API Route
app.get("/", (req, res) => res.send("API is running..."));

// Get all users (test route)
app.get("/getUsers", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: err.message });
    }
});

// server.js أو app.js

app.use(express.json());

// ربط الراوتر بتاع المواعيد
app.use("/api/maintenance", maintenanceRoutes);

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
