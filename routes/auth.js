const router = require("express").Router();
const { User } = require("../models/user");
const Joi = require("joi");
const bcrypt = require("bcrypt");



router.post("/", async (req, res) => {
  try {
    // Validate request body
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    // Check if the user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(401).send({ message: "Invalid email or password" });

    // Verify password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword)
      return res.status(401).send({ message: "Invalid email or password" });

    // Generate JWT
    const token = user.generateAuthTokens();
    res.status(200).send({ data: token, message: "Logged in successfully" });
  } catch (error) {
    console.error("Error during login:", error.message); // Log error for debugging
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Validation function
const validate = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().min(5).required().label("Password"),
  });
  return schema.validate(data);
};

module.exports = router;
