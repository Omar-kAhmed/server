
const express = require("express");
const router = express.Router();
const MaintenanceRequest = require("../models/MaintenanceRequest");
const nodemailer = require("nodemailer");

// إعداد الإيميل باستخدام app password من Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "omarkhaledahmedov7@gmail.com",
    pass: "cmqv nwgl njbh wfga", // حط هنا app password
  },
});

// حجز موعد جديد
router.post("/book", async (req, res) => {
  try {
    const { scheduledDate } = req.body;

    if (!scheduledDate) {
      return res.status(400).json({ message: "Date is required." });
    }

    const existing = await MaintenanceRequest.findOne({
      scheduledDate: new Date(scheduledDate),
      status: "Pending",
    });

    if (existing) {
      return res.status(400).json({ message: "This date and time is already booked." });
    }

    const newRequest = new MaintenanceRequest({
      scheduledDate: new Date(scheduledDate),
      status: "Pending",
    });

    await newRequest.save();

    // إرسال الإيميل
    const mailOptions = {
      from: "omarkhaledahmedov7@gmail.com",
      to: "omarkhaledahmedov7@gmail.com",
      subject: "New Appointment Booked",
      text: `A new appointment has been booked for: ${newRequest.scheduledDate}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully.");
    } catch (emailErr) {
      console.error("Failed to send email:", emailErr);
      // الإيميل فشل لكن الحجز تم
    }

    return res.status(201).json({ message: "Booking successful.", data: newRequest });

  } catch (error) {
    console.error("Error booking appointment:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;


