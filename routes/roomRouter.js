import express from 'express';
import { createRoom, getAllRooms, getRoom, updateRoom, deleteRoom } from '../controllers/roomController.js';
import { isAuthenticated, isAdmin } from '../middlewares/auth.js';  // Assuming auth middleware file is named auth.js

const router = express.Router();

// Public routes (accessible without admin privileges)
router.get('/rooms', isAuthenticated, getAllRooms);
router.get('/rooms/:id', isAuthenticated, getRoom);

// Routes that require authentication and admin privileges
router.post('/rooms', isAuthenticated, isAdmin, createRoom);  // Optionally restrict room creation
router.patch('/rooms/:id', isAuthenticated, isAdmin, updateRoom);
router.delete('/rooms/:id', isAuthenticated, isAdmin, deleteRoom);

export default router;
