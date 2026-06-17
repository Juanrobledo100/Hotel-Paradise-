const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título de la habitación es obligatorio'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
  },
  pricePerNight: {
    type: Number,
    required: [true, 'El precio por noche es obligatorio'],
    min: [0, 'El precio no puede ser negativo'],
  },
  capacity: {
    type: Number,
    required: [true, 'La capacidad es obligatoria'],
    min: [1, 'La capacidad mínima es 1 persona'],
  },
  beds: {
    type: String,
    default: '1 cama queen',
  },
  category: {
    type: String,
    default: 'Estándar',
  },
  amenities: [String],
  imageUrl: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['available', 'reserved', 'maintenance'],
    default: 'available',
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5,
  },
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
