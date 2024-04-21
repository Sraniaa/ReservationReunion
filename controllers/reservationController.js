// Import the reservation model from the schema file
import { Reservation } from '../models/reservationSchema.js';
import sendEmail from '../utils/emailSender.js';

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


// Create a new reservation with provided details and default status as 'pending'
const createReservation = async (req, res) => {
  const { room, startTime, endTime, purpose } = req.body;
  const user = req.user._id;

  try {
    const newReservation = new Reservation({
      user: user,
      room: room,
      startTime: startTime,
      endTime: endTime,
      purpose: purpose,
      status: 'pending', // Default status on creation
    });
    
    // Save the reservation to the database
    await newReservation.save();

    // Prepare and send the email notification
    const emailOptions = {
      email: user.email, // Ensure user object has email
      subject: 'Reservation Created',
      text: `Hi ${user.name},\n\nYour reservation for ${room} on ${new Date(startTime).toLocaleString()} to ${new Date(endTime).toLocaleString()} has been successfully created.\n\nPurpose: ${purpose}\n\nThank you for using our service.`,

    };

    await sendEmail(emailOptions);

    // Respond to the client after email is sent
    res.status(201).json({ message: "Reservation created successfully", reservation: newReservation });
  } catch (error) {
    console.error("Reservation creation failed:", error);
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

    // Check if the status has changed to 'cancelled' or 'confirmed' and send an email accordingly
    if (status && status !== reservation.status) {
      let subject, text;

      if (status === 'cancelled') {
        subject = 'Reservation Cancelled';
        text = `Your reservation for ${reservation.room} on ${reservation.date} has been cancelled.`;
      } else if (status === 'confirmed') {
        subject = 'Reservation Confirmed';
        text = `Your reservation for ${reservation.room} on ${reservation.date} has been confirmed.`;
      } else {
        // For other status changes or updates, you can add additional conditions here
      }

      // Send email for status change
      if (subject && text) {
        await sendEmail({
          email: req.user.email, // Replace with actual recipient email
          subject,
          text,
        });
      }
    }

    // Update reservation details
    reservation.startTime = startTime || reservation.startTime;
    reservation.endTime = endTime || reservation.endTime;
    reservation.purpose = purpose || reservation.purpose;
    reservation.status = status || reservation.status;
    await reservation.save();

    // Send a general update email if there were changes other than status updates
    if (!status || status === reservation.status) {
      await sendEmail({
        email: req.user.email,
        subject: 'Reservation Updated',
        text: `Your reservation details have been updated.\n\nNew details:\nRoom: ${reservation.room}\nDate: ${reservation.date}\nStart Time: ${reservation.startTime}\nEnd Time: ${reservation.endTime}`,
      });
    }

    res.status(200).json({ message: "Reservation updated successfully", reservation });
  } catch (error) {
    console.error("Failed to update reservation:", error);
    res.status(500).json({ message: "Failed to update reservation", error: error.message });
  }
};



// Export all controller functions to be used in routes
export { createReservation, updateReservation, getAllReservations, getMyReservations, getReservationDetails };
