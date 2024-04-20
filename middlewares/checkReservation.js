import { Reservation } from '../models/reservationSchema.js'; // Assuming this is the correct path

// Middleware to check for overlapping reservations
const checkReservationOverlap = async (req, res, next) => {
  const { room, startTime, endTime } = req.body;
  const reservationId = req.params.id; // This may or may not be present depending on the operation (create vs update)

  // Find any overlapping reservation that is not cancelled
  const query = {
    room: room,
    endTime: { $gt: startTime },
    startTime: { $lt: endTime },
    status: { $in: ["confirmed", "pending"] } // Only consider reservations that are confirmed or pending
  };

  // Exclude current reservation for update operations
  if (reservationId) {
    query._id = { $ne: reservationId };
  }

  try {
    const overlappingReservation = await Reservation.findOne(query);
    if (overlappingReservation) {
      return res.status(400).json({ message: "Room is already booked for the given time range." });
    }
    next(); // No overlapping reservation found, proceed to the next middleware
  } catch (error) {
    res.status(500).json({ message: "Failed to check reservations due to an error", error: error.message });
  }
};

export default checkReservationOverlap;
