const Payment = require('../models/Payment');
const Reservation = require('../models/Reservation');

exports.createPayment = async (req, res, next) => {
  try {
    const { reservationId, amount, method, status, payerName, transactionId } = req.body;
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reserva no encontrada' });
    }

    if (reservation.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'No autorizado para crear pago para esta reserva' });
    }

    const payment = await Payment.create({
      reservation: reservationId,
      user: req.user.id,
      amount,
      method,
      status,
      payerName,
      transactionId: transactionId || '',
    });

    if (status === 'paid') {
      reservation.status = 'confirmed';
      await reservation.save();
    }

    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

exports.getUserPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ user: req.user.id }).populate('reservation');
    res.json({ success: true, data: payments });
  } catch (error) {
    next(error);
  }
};

exports.getAllPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find().populate('user', 'name email').populate('reservation');
    res.json({ success: true, data: payments });
  } catch (error) {
    next(error);
  }
};

exports.updatePaymentStatus = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Pago no encontrado' });
    }

    payment.status = req.body.status || payment.status;
    payment.transactionId = req.body.transactionId || payment.transactionId;
    await payment.save();

    if (payment.status === 'paid') {
      const reservation = await Reservation.findById(payment.reservation);
      if (reservation) {
        reservation.status = 'confirmed';
        await reservation.save();
      }
    }

    res.json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};
