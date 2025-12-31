import Contact from "../models/Contact.js";

/**
 * @desc   Save contact message
 * @route  POST /api/contact
 * 🇮🇳 Used for customer enquiries, feedback, and hotel support messages
 */
export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // 🇮🇳 Basic validation for Indian customer enquiry forms
    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🇮🇳 Store enquiry in database for hotel admin/support team
    const contact = await Contact.create({
      name,
      email,
      message,
    });

    // 🇮🇳 Standard success response for Indian service websites
    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: contact,
    });
  } catch (error) {
    console.error("Contact Error:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
};
