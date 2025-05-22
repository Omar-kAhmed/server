const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Appointment = require("../models/Appointment");

const router = express.Router();

// Route to book an appointment
router.post("/", authMiddleware, async (req, res) => {
    const { date, timeSlot } = req.body;

    if (!date || !timeSlot) {
        return res.status(400).send({ success: false, message: "Date and time slot are required" });
    }

    try {
        const existingAppointment = await Appointment.findOne({
            userId: req.user._id,
            date,
        });

        if (existingAppointment) {
            return res.status(400).send({ success: false, message: "You already have an appointment on this day." });
        }

        const appointmentAtSlot = await Appointment.findOne({ date, timeSlot });

        if (appointmentAtSlot) {
            return res.status(400).send({
                success: false,
                message: `The time slot ${timeSlot} is already booked for this date.`,
            });
        }

        const appointment = new Appointment({
            userId: req.user._id,
            date,
            timeSlot,
        });

        await appointment.save();

        res.status(200).send({ success: true, message: "Appointment booked successfully!", data: { date, timeSlot } });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Failed to book appointment" });
    }
});

// Route to get available appointment slots
router.get("/slots", authMiddleware, async (req, res) => {
    try {
        const availableSlots = ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM"];
        const today = new Date().toISOString().split("T")[0];

        const bookedSlots = await Appointment.find({ date: today }).select("timeSlot");
        const bookedSlotTimes = bookedSlots.map((appointment) => appointment.timeSlot);

        const availableSlotTimes = availableSlots.filter((slot) => !bookedSlotTimes.includes(slot));

        res.status(200).send({ success: true, availableSlots: availableSlotTimes });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Failed to fetch available slots" });
    }
});

module.exports = router;
