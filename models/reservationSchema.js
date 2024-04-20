import mongoose from 'mongoose';
import { Room } from './roomSchema.js';  // Ensure the path is correct
import { User } from './userSchema.js';  // Ensure the path is correct

const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  purpose: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['confirmed', 'pending', 'cancelled'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Reservation = mongoose.model('Reservation', reservationSchema);

export { Reservation };
