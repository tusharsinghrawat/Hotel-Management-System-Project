import express from "express";
import Contact from "../models/Contact.js";

const router = express.Router();

/**
 * @route   POST /api/contact
 * @desc    Contact form submission
 * @access  Public
 */
router.post("/", async (req, res) => {
  try {
    console.log("CONTACT API HIT");            // 🔴 ADD
    console.log("REQUEST BODY:", req.body);    // 🔴 ADD

    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    console.log("CONTACT SAVED:", contact);    // 🔴 ADD

    res.status(200).json({
      success: true,
      message: "Message received successfully",
    });
  } catch (error) {
    console.error("Contact Save Error:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
