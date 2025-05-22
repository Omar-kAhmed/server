// models/MaintenanceRequest.js
const mongoose = require("mongoose");

const maintenanceRequestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true }, // علاقة واحد لواحد
  scheduledDate: { type: Date, required: true }, // تاريخ ووقت الحجز
  status: { type: String, default: "Pending" }, // حالة الطلب (معلق، مكتمل، ملغي..)
  createdAt: { type: Date, default: Date.now },
});

const MaintenanceRequest = mongoose.model("MaintenanceRequest", maintenanceRequestSchema);

module.exports = MaintenanceRequest;
