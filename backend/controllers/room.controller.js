import Room from "../models/Room.js";

/**
 * @desc   Get all rooms
 * @route  GET /api/rooms
 */
export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Get single room
 * @route  GET /api/rooms/:id
 */
export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Create room (Admin)
 * @route  POST /api/rooms
 */
export const createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc   Update room (Admin)
 * @route  PUT /api/rooms/:id
 */
export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(room);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc   Delete room (Admin)
 * @route  DELETE /api/rooms/:id
 */
export const deleteRoom = async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: "Room deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ✅ NEW (IMPORTANT)
 * @desc   Get featured rooms
 * @route  GET /api/rooms/featured
 */
export const getFeaturedRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ is_available: true }).limit(3);
    res.json(rooms);
  } catch (error) {
    console.error("Featured Rooms Error:", error);
    res.status(500).json({ message: error.message });
  }
};
