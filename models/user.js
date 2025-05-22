const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    carMake: { type: String, required: true },
    carModel: { type: String, required: true },
    carYear: { type: Number, required: true },
    milesDriven: { type: Number, default: 0 }, // Default to 0 if not provided
    lastUpdate: { type: Date, default: Date.now }, // Default to current date
});

// Method to generate JWT tokens
userSchema.methods.generateAuthTokens = function () {
    const token = jwt.sign(
        { _id: this._id }, // Payload
        process.env.JWTPRIVATEKEY, // Secret key
        { expiresIn: "7d" } // Token validity
    );
    return token;
};

const User = mongoose.model("User", userSchema);

// Validation schema for new user data
const validate = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().required().label("First Name"),
        lastName: Joi.string().required().label("Last Name"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password"),
        carMake: Joi.string().required().label("Car Make"),
        carModel: Joi.string().required().label("Car Model"),
        carYear: Joi.number()
            .integer()
            .min(1886)
            .max(new Date().getFullYear() + 10) // Allow up to 10 years in the future
            .required()
            .label("Car Year"),
        milesDriven: Joi.number().integer().min(0).default(0).label("Miles Driven"),
    });
    return schema.validate(data);
};

module.exports = { User, validate };
