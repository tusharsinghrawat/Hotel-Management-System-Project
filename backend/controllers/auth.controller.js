import User from "../models/User.js";
import jwt from "jsonwebtoken";

/**
 * @desc Register user
 * @route POST /api/auth/register
 */
export const registerUser = async (req, res) => {
  try {
    // ✅ SAFE destructuring
    const { full_name, email, password } = req.body || {};

    if (
      !full_name ||
      !email ||
      !password ||
      !full_name.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email: email.trim() });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ❗ password hashing model ke pre-save hook me hoga
    const user = await User.create({
      full_name: full_name.trim(),
      email: email.trim(),
      password: password.trim(),
    });

    res.status(201).json({
      _id: user._id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Register Error:", error);

    // ✅ Mongo duplicate key error handle
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already registered" });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc Login user
 * @route POST /api/auth/login
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email: email.trim() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      _id: user._id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
