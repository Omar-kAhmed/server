const mongoose = require("mongoose");

const ConsultationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    query: { type: String, required: true },
    filePath: { type: String }, // Path to the uploaded file
});

module.exports = mongoose.model("Consultation", ConsultationSchema);
