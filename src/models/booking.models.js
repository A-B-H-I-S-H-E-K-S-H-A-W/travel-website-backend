// const mongoose = require("mongoose");

// const bookingSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   bookedAt: { type: Date, default: Date.now },
//   travelDate: { type: Date, required: true },

//   // Optional references depending on what's booked
//   bus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", default: null },
//   hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", default: null },
//   flight: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Flight",
//     default: null,
//   },
// });

// module.exports = mongoose.model("Booking", bookingSchema);
