const Reservation = require('../models/Reservation');
const Room = require('../models/Room');

exports.createReservation = async (req, res, next) => {
  try {
    const { roomId, checkIn, checkOut, guests, totalPrice } = req.body;
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Habitación no encontrada' });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ success: false, message: 'La fecha de check-out debe ser posterior al check-in' });
    }

    const overlappingReservation = await Reservation.findOne({
      room: roomId,
      status: { $in: ['pending', 'confirmed', 'completed'] },
      $or: [
        { checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } },
      ],
    });

    if (overlappingReservation) {
      return res.status(400).json({ success: false, message: 'La habitación no está disponible en esas fechas' });
    }

    const reservation = await Reservation.create({
      user: req.user.id,
      room: roomId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      totalPrice,
      status: 'pending',
    });

    res.status(201).json({ success: true, data: reservation });
  } catch (error) {
    next(error);
  }
};

exports.getUserReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id }).populate('room');
    res.json({ success: true, data: reservations });
  } catch (error) {
    next(error);
  }
};

exports.getAllReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find().populate('user room');
    res.json({ success: true, data: reservations });
  } catch (error) {
    next(error);
  }
};

exports.updateReservationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reserva no encontrada' });
    }

    reservation.status = status;
    await reservation.save();

    res.json({ success: true, data: reservation });
  } catch (error) {
    next(error);
  }
};

exports.cancelReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reserva no encontrada' });
    }
    if (reservation.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'No autorizado para cancelar esta reserva' });
    }
    reservation.status = 'cancelled';
    await reservation.save();
    res.json({ success: true, data: reservation });
  } catch (error) {
    next(error);
  }
};