const Carousel = require('../models/Carousel');

exports.createCarouselItem = async (req, res, next) => {
  try {
    const item = await Carousel.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

exports.getCarouselItems = async (req, res, next) => {
  try {
    const items = await Carousel.find({ active: true }).sort({ order: 1 });
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

exports.getAllCarouselItems = async (req, res, next) => {
  try {
    const items = await Carousel.find().sort({ order: 1 });
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

exports.updateCarouselItem = async (req, res, next) => {
  try {
    const item = await Carousel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Elemento de carrusel no encontrado' });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

exports.deleteCarouselItem = async (req, res, next) => {
  try {
    const item = await Carousel.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Elemento de carrusel no encontrado' });
    }
    await item.deleteOne();
    res.json({ success: true, message: 'Elemento eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};
