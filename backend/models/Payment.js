const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  reservation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: [true, 'El monto es obligatorio'],
    min: [0, 'El monto no puede ser negativo'],
  },
  method: {
    type: String,
    enum: ['card', 'cash'],
    default: 'cash',
  },
  status: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending',
  },
  payerName: {
    type: String,
    trim: true,
    required: [true, 'El nombre del pagador es obligatorio'],
  },
  transactionId: {
    type: String,
    trim: true,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
