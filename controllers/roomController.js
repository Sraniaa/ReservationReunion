import { Room } from '../models/roomSchema.js'; // Import the Room model

// POST /rooms - Create a new room
const createRoom = async (req, res) => {
  try {
    const { name, capacity, equipment, description } = req.body;
    const room = new Room({ name, capacity, equipment, description });
    await room.save();
    res.status(201).send({ message: "Room created successfully", room });
  } catch (error) {
    res.status(400).send({ message: "Error creating room", error: error.message });
  }
};

// GET /rooms - Retrieve all rooms
const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.status(200).send(rooms);
  } catch (error) {
    res.status(500).send({ message: "Error fetching rooms", error: error.message });
  }
};

// GET /rooms/:id - Get a single room by ID
const getRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).send({ message: "Room not found" });
    }
    res.status(200).send(room);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving room", error: error.message });
  }
};

// PATCH /rooms/:id - Partially update a room by ID
const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).send({ message: "Room not found" });
    }
    Object.keys(updates).forEach((update) => room[update] = updates[update]);
    await room.save();
    res.status(200).send({ message: "Room updated successfully", room });
  } catch (error) {
    res.status(400).send({ message: "Error updating room", error: error.message });
  }
};

// DELETE /rooms/:id - Delete a room by ID
const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findByIdAndDelete(id);
    if (!room) {
      return res.status(404).send({ message: "Room not found" });
    }
    res.status(200).send({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error deleting room", error: error.message });
  }
};

// Export all functions as a module
export { createRoom, getAllRooms, getRoom, updateRoom, deleteRoom };
