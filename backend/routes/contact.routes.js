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
    console.log("CONTACT API HIT");
    console.log("REQUEST BODY:", req.body);

    const { name, email, subject, message } = req.body;

    // ✅ FIX: subject optional
    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const contact = await Contact.create({
      name,
      email,
      subject: subject || "", // ✅ safe default
      message,
    });

    console.log("CONTACT SAVED:", contact);

    res.status(201).json({
      success: true,
      message: "Message received successfully",
    });
  } catch (error) {
    console.error("Contact Save Error:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
