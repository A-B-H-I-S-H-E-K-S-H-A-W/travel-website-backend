import { Schema, Types, model } from "mongoose";

const hotelSchema = Schema(
  {
    owner: {
      type: Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    name: {
      type: String,
      required: true,
      uppercase: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      required: true,
      enum: ["Luxury", "Budget", "Boutique"],
    },
    highlight: {
      type: [String],
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    address: {
      type: String,
      required: true,
    },
    landmark: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    checkInTime: {
      type: String,
      required: true,
    },
    checkOutTime: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    images: {
      type: [String],
      default: [],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Hotel = model("Hotel", hotelSchema);

const roomSchema = Schema(
  {
    hotel: {
      type: Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    bedType: {
      type: String,
      required: true,
      enum: ["King Size", "Queen Size", "Twin"],
    },
    maxPerson: {
      type: Number,
      required: true,
    },
    facilities: {
      type: [String],
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
    },
    discountedAmount: {
      type: Number,
      required: true,
    },
    payment: {
      type: String,
      required: true,
      enum: ["Book now and pay online", "Book now and pay at hotel"],
    },
    images: {
      type: [String],
      required: true,
    },
    totalRooms: {
      type: Number,
      required: true,
    },
    booked: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Room = model("Room", roomSchema);
