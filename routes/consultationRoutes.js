const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", authMiddleware, upload.single("file"), async (req, res) => {
    try {
        const { name, email, query } = req.body;
        const file = req.file;

        // Example: Save consultation to the database (requires a Consultation model)
        // const consultation = new Consultation({ name, email, query, filePath: file?.path });
        // await consultation.save();

        res.status(200).send({
            success: true,
            message: "Consultation received successfully!",
            data: {
                name,
                email,
                query,
                fileUploaded: !!file,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Failed to process consultation request" });
    }
});

module.exports = router;
