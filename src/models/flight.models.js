import { Schema, Types, model } from "mongoose";

const flightSchema = Schema({
  owner: {
    type: Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  flightNumber: {
    type: String,
    required: true,
  },
  airline: {
    type: String,
    required: true,
  },
  aircraftType: {
    type: String,
    required: true,
  },
  departureCity: {
    type: String,
    required: true,
  },
  arrivalCity: {
    type: String,
    required: true,
  },
  departureAirport: {
    type: String,
    required: true,
  },
  arrivalAirport: {
    type: String,
    required: true,
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
  },
  classType: {
    type: String,
    required: true,
    enum: ["Economy", "Premium Economy", "Business", "First"],
  },
  totalSeats: {
    type: Number,
    required: true,
  },
  availableSeats: {
    type: Number,
    required: true,
  },
  mealIncluded: {
    type: Boolean,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  finalAmount: {
    type: Number,
    required: true,
  },
  images: {
    type: [String],
    default: [],
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["Scheduled", "Delayed", "Cancelled", "Completed"],
  },
  isActive: {
    type: Boolean,
    required: true,
  },
});

export const Flight = model("Flight", flightSchema);
