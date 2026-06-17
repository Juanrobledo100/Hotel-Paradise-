const Room = require('../models/Room');

exports.getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find();
    res.json({ success: true, data: rooms });
  } catch (error) {
    next(error);
  }
};

exports.getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Habitación no encontrada' });
    }
    res.json({ success: true, data: room });
  } catch (error) {
    next(error);
  }
};

exports.createRoom = async (req, res, next) => {
  try {
    const { title, description, pricePerNight, capacity, beds, category, amenities, imageUrl } = req.body;
    const room = await Room.create({
      title,
      description,
      pricePerNight,
      capacity,
      beds,
      category,
      amenities,
      imageUrl,
    });
    res.status(201).json({ success: true, data: room });
  } catch (error) {
    next(error);
  }
};

exports.updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Habitación no encontrada' });
    }

    Object.assign(room, req.body);
    await room.save();

    res.json({ success: true, data: room });
  } catch (error) {
    next(error);
  }
};

exports.deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Habitación no encontrada' });
    }

    await room.remove();
    res.json({ success: true, message: 'Habitación eliminada correctamente' });
  } catch (error) {
    next(error);
  }
};
