// routes/appointmentRoutes.js
const express = require('express');
const Appointment = require('../models/Appointment');

const router = express.Router();

/**
 * @route   POST /api/appointments
 * @desc    Book a new appointment
 */
router.post('/', async (req, res) => {
  try {
    const {
      doctorName,
      speciality,
      userName,
      userPhone,
      appointmentFees,
      bookingStatus, // optional, defaults to "booked"
      appointmentDate,
      appointmentTime,
    } = req.body;

    if (
      !doctorName ||
      !speciality ||
      !userName ||
      !userPhone ||
      !appointmentFees ||
      !appointmentDate ||
      !appointmentTime
    ) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newAppointment = new Appointment({
      doctorName,
      speciality,
      userName,
      userPhone,
      appointmentFees,
      bookingStatus,
      appointmentDate,
      appointmentTime,
    });

    const saved = await newAppointment.save();
    return res.status(201).json(saved);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/appointments/user/:phone
 * @desc    Get all appointments of a user by phone number
 */
router.get('/user/:phone', async (req, res) => {
  try {
    const { phone } = req.params;

    const appointments = await Appointment.find({ userPhone: phone }).sort({
      appointmentDate: -1,
      createdAt: -1,
    });

    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   DELETE /api/appointments/:id
 * @desc    Cancel (delete) an appointment
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Appointment.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
