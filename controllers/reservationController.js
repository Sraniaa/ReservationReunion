// Import the reservation model from the schema file
import { Reservation } from '../models/reservationSchema.js';

// Retrieve all reservations with populated user and room details
const getAllReservations = async (req, res) => {
    try {
      const reservations = await Reservation.find({}).populate('user').populate('room');
      res.status(200).json(reservations);
    } catch (error) {
      res.status(500).json({ message: "Error fetching reservations", error: error.message });
    }
  };

// Retrieve reservations made by the logged-in user with populated room details
const getMyReservations = async (req, res) => {
    try {
      const userReservations = await Reservation.find({ user: req.user._id }).populate('room');
      res.status(200).json(userReservations);
    } catch (error) {
      res.status(500).json({ message: "Error fetching your reservations", error: error.message });
    }
  };

// Get details of a specific reservation, ensuring authorization before proceeding
const getReservationDetails = async (req, res) => {
    try {
      const reservation = await Reservation.findById(req.params.id).populate('user').populate('room');
      if (!reservation) {
        return res.status(404).json({ message: "Reservation not found" });
      }
  
      // Authorization check to ensure user is owner or admin
      if (reservation.user._id.equals(req.user._id) || req.user.role === 'admin' || req.user.role === 'superadmin') {
        res.status(200).json(reservation);
      } else {
        res.status(403).json({ message: "Not authorized to view this reservation" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error retrieving reservation", error: error.message });
    }
  };

// Cancel a reservation by updating its status to 'cancelled', includes authorization check
const cancelReservation = async (req, res) => {
    const { id } = req.params;
  
    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found." });
    }
  
    // Permission check: only the reservation owner or an admin can cancel it
    if (!reservation.user._id.equals(req.user._id) && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ message: "You do not have permission to cancel this reservation." });
    }
  
    // Update the reservation status to 'cancelled' and save
    reservation.status = 'cancelled';
    await reservation.save();
  
    res.status(200).json({ message: "Reservation cancelled successfully", reservation });
  };

// Create a new reservation with provided details and default status as 'pending'
const createReservation = async (req, res) => {
  const { room, startTime, endTime, purpose } = req.body;
  const user = req.user._id;  // Assuming the user is authenticated and user ID is available

  try {
    const newReservation = new Reservation({
      user: user,
      room: room,
      startTime: startTime,
      endTime: endTime,
      purpose: purpose,
      status: 'pending',  // Default status on creation
    });
    await newReservation.save();
    res.status(201).json({ message: "Reservation created successfully", reservation: newReservation });
  } catch (error) {
    res.status(500).json({ message: "Failed to create reservation", error: error.message });
  }
};

// Update existing reservation, ensuring authorization and checking for data integrity before saving changes
const updateReservation = async (req, res) => {
  const { startTime, endTime, purpose, status } = req.body;
  const { id } = req.params;

  try {
    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // Authorization check for updates
    if (!reservation.user._id.equals(req.user._id) && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ message: "You do not have permission to update this reservation" });
    }

    // Update reservation details
    reservation.startTime = startTime;
    reservation.endTime = endTime;
    reservation.purpose = purpose;
    reservation.status = status;
    await reservation.save();

    res.status(200).json({ message: "Reservation updated successfully", reservation });
  } catch (error) {
    res.status(500).json({ message: "Failed to update reservation", error: error.message });
  }
};

// Export all controller functions to be used in routes
export { createReservation, updateReservation, getAllReservations, getMyReservations, getReservationDetails, cancelReservation };
