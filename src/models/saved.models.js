import mongoose, { Schema } from "mongoose";

const savedSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    savedBuses: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Bus",
      },
    ],
    savedFlights: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Flight",
      },
    ],
    savedHotels: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Hotel",
      },
    ],
  },
  { timestamps: true }
);

export const Saved = mongoose.model("Saved", savedSchema);
