import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.routes.js";
import roomRoutes from "./routes/room.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import contactRoutes from "./routes/contact.routes.js";

dotenv.config();

const app = express();

// ================== MIDDLEWARES ==================

// ✅ CORS FIX (IMPORTANT)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://hotel-management-system-project-frontend.onrender.com"
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================== STATIC FILES ==================

// existing uploads (UNCHANGED)
app.use("/uploads", express.static("uploads"));

// ❌ REMOVE THIS (frontend now handles room images)
// app.use(
//   "/rooms",
//   express.static(path.join(process.cwd(), "frontend/public/rooms"))
// );

// ================== ROUTES ==================
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/contact", contactRoutes);

// ================== ROOT TEST ==================
app.get("/", (req, res) => {
  res.send("✅ Hotel Backend Running Successfully");
});

// ================== DB + SERVER ==================
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () =>
      console.log(`✅ Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });

