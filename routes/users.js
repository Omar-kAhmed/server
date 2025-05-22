const express = require("express");
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const multer = require("multer");
const Appointment = require("../models/Appointment"); // Import the Appointment model

const router = express.Router();

// Middleware to authenticate and verify JWT token
const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return res.status(401).send({ message: "Access denied. Please log in to access this resource." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).send({ message: "Session expired or invalid. Please log in again." });
    }
};

// Middleware to fetch user details
const fetchUserMiddleware = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).send({ message: "User not found" });
        req.userDetails = user;
        next();
    } catch (error) {
        next(error);
    }
};

// Utility to calculate miles per day
const calculateMilesPerDay = (milesDriven, carYear) => {
    const currentYear = new Date().getFullYear();
    const carAgeYears = Math.max(currentYear - carYear, 1);
    return milesDriven / (365 * carAgeYears);
};

// Input validation schema for updating miles
const updateMilesSchema = Joi.object({
    milesDriven: Joi.number().positive().required(),
});

const validateUpdateMiles = (req, res, next) => {
    const { error } = updateMilesSchema.validate(req.body);
    if (error) {
        return res.status(400).send({ message: error.details[0].message });
    }
    next();
};

// Route to get the authenticated user's details
router.get("/me", authMiddleware, fetchUserMiddleware, (req, res) => {
    res.status(200).send(req.userDetails);
});

// Route to update the authenticated user's miles driven
router.put("/update-miles", authMiddleware, fetchUserMiddleware, validateUpdateMiles, async (req, res, next) => {
    try {
        const { userDetails: user } = req;
        const currentDate = new Date();
        const lastUpdateDate = new Date(user.lastUpdate);
        const daysPassed = Math.floor((currentDate - lastUpdateDate) / (1000 * 60 * 60 * 24));

        const milesPerDay = calculateMilesPerDay(user.milesDriven, user.carYear);
        const additionalMiles = milesPerDay * daysPassed;

        user.milesDriven += additionalMiles;
        user.lastUpdate = currentDate;
        await user.save();

        res.status(200).send({ message: "Miles updated successfully", user });
    } catch (err) {
        next(err);
    }
});

// Route to register a new user
router.post("/", async (req, res, next) => {
    try {
        const { error } = validate(req.body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }

        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).send({ message: "User with this email already exists" });
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT) || 10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const user = new User({
            ...req.body,
            lastUpdate: Date.now(),
        });

        await user.save();
        res.status(201).send({ message: "User created successfully" });
    } catch (error) {
        next(error);
    }
});


// Error handling middleware
router.use((err, req, res, next) => {
    res.status(err.status || 500).send({ message: err.message || "Internal Server Error" });
});

module.exports = router;
