import { Schema, Types, model } from "mongoose";

const busSchema = new Schema(
  {
    owner: {
      type: Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    busNumber: {
      type: String,
      required: true,
      uppercase: true,
    },
    busName: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
      uppercase: true,
    },
    destination: {
      type: String,
      required: true,
      uppercase: true,
    },
    departureTime: {
      type: Date,
      required: true,
    },
    arrivalTime: {
      type: Date,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    totalSeats: {
      type: Number,
      required: true,
    },
    availableSeats: {
      type: Number,
      required: true,
    },
    bookedSeats: {
      type: Number,
      required: true,
    },
    fare: {
      type: Number,
      required: true,
    },
    busType: {
      type: String,
      required: true,
      enum: ["AC Sleeper", "Non-AC Seater", "Sleeper", "AC Seater"],
    },
    operatingDays: {
      type: String,
      required: true,
      enum: ["Mon", "Tue", "Wed", "Thus", "Fri", "Sat", "Sun"],
    },
    images: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Bus = model("Bus", busSchema);
