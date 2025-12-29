import express from "express";
import {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  getFeaturedRooms,
} from "../controllers/room.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";

const router = express.Router();

/**
 * ✅ IMAGE SANITIZER MIDDLEWARE (NEW)
 * Prevent empty / invalid image paths from reaching DB
 */
const sanitizeRoomImages = (req, res, next) => {
  if (Array.isArray(req.body.image_urls)) {
    req.body.image_urls = req.body.image_urls
      .map((img) => (typeof img === "string" ? img.trim() : ""))
      .filter((img) => img && img !== "/rooms");
  }
  next();
};

// ================== PUBLIC ROUTES ==================
router.get("/", getAllRooms);
router.get("/featured", getFeaturedRooms);
router.get("/:id", getRoomById);

// ================== ADMIN ROUTES ==================
router.post(
  "/",
  protect,
  adminOnly,
  sanitizeRoomImages, // ✅ ADD
  createRoom
);

router.put(
  "/:id",
  protect,
  adminOnly,
  sanitizeRoomImages, // ✅ ADD
  updateRoom
);

router.delete("/:id", protect, adminOnly, deleteRoom);

export default router;
