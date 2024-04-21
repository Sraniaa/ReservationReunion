import express from 'express';
import { isAdmin, isAuthenticated } from '../middlewares/auth.js'; // Authentication middleware to ensure user is logged in
import checkReservationOverlap from '../middlewares/checkReservation.js'; // Middleware to prevent booking overlaps
import {
  createReservation,
  updateReservation,
  getAllReservations,
  getMyReservations,
  getReservationDetails,
} from '../controllers/reservationController.js'; // Reservation controller functions

const router = express.Router();

// Retrieves all reservations, potentially filtered by query parameters for admin use
router.get('/reservations/all', isAuthenticated,isAdmin, getAllReservations); // Only admins can access this, adjust auth middleware accordingly

// Retrieves all reservations made by the currently logged-in user, providing a personal dashboard view
router.get('/reservations/my', isAuthenticated, getMyReservations); // User-specific reservations

// Retrieves detailed information about a specific reservation, including user and room details
router.get('/reservations/:id', isAuthenticated, getReservationDetails); // Detailed view of a specific reservation

// Creates a new reservation, checks for any time conflicts before proceeding
router.post('/reservations', isAuthenticated, checkReservationOverlap, createReservation); // Submit a new reservation request

// Updates an existing reservation, ensuring no overlaps with other bookings and that the requester has the right to modify
router.patch('/reservations/:id', isAuthenticated, checkReservationOverlap, updateReservation); // Modify details of an existing reservation

export default router;
