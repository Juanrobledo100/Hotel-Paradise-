const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true,
  },
  discountPercent: {
    type: Number,
    required: [true, 'El descuento es obligatorio'],
    min: [1, 'El descuento debe ser al menos 1%'],
    max: [100, 'El descuento no puede exceder 100%'],
  },
  startDate: {
    type: Date,
    required: [true, 'La fecha de inicio es obligatoria'],
  },
  endDate: {
    type: Date,
    required: [true, 'La fecha de fin es obligatoria'],
  },
  active: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Promotion', promotionSchema);
