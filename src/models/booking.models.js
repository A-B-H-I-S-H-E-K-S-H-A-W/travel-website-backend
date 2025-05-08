import { Schema, Types, model } from "mongoose";

const bookingSchema = new Schema({
  user: { type: Types.ObjectId, ref: "User", required: true },
  bookedAt: { type: Date, default: Date.now },
  travelDate: { type: Date, required: true },
  bus: { type: Types.ObjectId, ref: "Bus", default: null },
  hotel: { type: Types.ObjectId, ref: "Hotel", default: null },
  flight: {
    type: Types.ObjectId,
    ref: "Flight",
    default: null,
  },
});

export const Booking = model("Booking", bookingSchema);
