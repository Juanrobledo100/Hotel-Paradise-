const Reservation = require('../models/Reservation');
const Room = require('../models/Room');

const getMonthRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const { start, end } = getMonthRange();

    const monthlyReservations = await Reservation.find({
      createdAt: { $gte: start, $lte: end },
    });

    const totalIncome = monthlyReservations.reduce((sum, reservation) => sum + reservation.totalPrice, 0);
    const reservationsCount = monthlyReservations.length;

    const totalRooms = await Room.countDocuments();
    const now = new Date();
    const occupiedReservations = await Reservation.countDocuments({
      status: { $in: ['pending', 'confirmed'] },
      checkIn: { $lte: now },
      checkOut: { $gt: now },
    });
    const occupiedPercentage = totalRooms === 0 ? 0 : Math.round((occupiedReservations / totalRooms) * 100);

    const ratingResult = await Room.aggregate([
      { $group: { _id: null, averageRating: { $avg: '$rating' } } },
    ]);
    const averageRating = ratingResult[0] ? Number(ratingResult[0].averageRating.toFixed(1)) : 0;

    res.json({
      success: true,
      data: {
        totalIncome,
        reservationsCount,
        occupiedPercentage,
        averageRating,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getPopularRooms = async (req, res, next) => {
  try {
    const results = await Reservation.aggregate([
      { $group: { _id: '$room', totalReservations: { $sum: 1 } } },
      { $sort: { totalReservations: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'rooms',
          localField: '_id',
          foreignField: '_id',
          as: 'room',
        },
      },
      { $unwind: '$room' },
      {
        $project: {
          _id: '$room._id',
          title: '$room.title',
          imageUrl: '$room.imageUrl',
          totalReservations: 1,
        },
      },
    ]);

    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

exports.getRecentReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .populate('user', 'name email')
      .populate('room', 'title pricePerNight');

    res.json({ success: true, data: reservations });
  } catch (error) {
    next(error);
  }
};
