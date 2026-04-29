const mongoose = require('mongoose');

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
  checkIn: {
    type: Date,
    required: [true, 'La fecha de check-in es obligatoria'],
  },
  checkOut: {
    type: Date,
    required: [true, 'La fecha de check-out es obligatoria'],
  },
  guests: {
    type: Number,
    required: [true, 'El número de huéspedes es obligatorio'],
    min: [1, 'Debe haber al menos un huésped'],
  },
  totalPrice: {
    type: Number,
    required: [true, 'El precio total es obligatorio'],
    min: [0, 'El precio total no puede ser negativo'],
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
}, { timestamps: true });

reservationSchema.pre('save', function (next) {
  if (this.checkIn >= this.checkOut) {
    return next(new Error('La fecha de check-out debe ser posterior a la fecha de check-in'));
  }
  next();
});

module.exports = mongoose.model('Reservation', reservationSchema);
