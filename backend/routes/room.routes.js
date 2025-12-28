import express from "express";
import {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  getFeaturedRooms, // ✅ ADD
} from "../controllers/room.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";

const router = express.Router();

// Public
router.get("/", getAllRooms);
router.get("/featured", getFeaturedRooms); // ✅ ADD (IMPORTANT)
router.get("/:id", getRoomById);

// Admin
router.post("/", protect, adminOnly, createRoom);
router.put("/:id", protect, adminOnly, updateRoom);
router.delete("/:id", protect, adminOnly, deleteRoom);

export default router;
