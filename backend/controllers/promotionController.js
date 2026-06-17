const Promotion = require('../models/Promotion');

exports.createPromotion = async (req, res, next) => {
  try {
    const promotion = await Promotion.create(req.body);
    res.status(201).json({ success: true, data: promotion });
  } catch (error) {
    next(error);
  }
};

exports.getPromotions = async (req, res, next) => {
  try {
    const promotions = await Promotion.find({ active: true, startDate: { $lte: new Date() }, endDate: { $gte: new Date() } });
    res.json({ success: true, data: promotions });
  } catch (error) {
    next(error);
  }
};

exports.getAllPromotions = async (req, res, next) => {
  try {
    const promotions = await Promotion.find();
    res.json({ success: true, data: promotions });
  } catch (error) {
    next(error);
  }
};

exports.updatePromotion = async (req, res, next) => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!promotion) {
      return res.status(404).json({ success: false, message: 'Promoción no encontrada' });
    }
    res.json({ success: true, data: promotion });
  } catch (error) {
    next(error);
  }
};

exports.togglePromotion = async (req, res, next) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) {
      return res.status(404).json({ success: false, message: 'Promoción no encontrada' });
    }
    promotion.active = !promotion.active;
    await promotion.save();
    res.json({ success: true, data: promotion });
  } catch (error) {
    next(error);
  }
};
