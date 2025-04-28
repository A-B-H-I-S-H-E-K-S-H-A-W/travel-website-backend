import { Schema, model } from "mongoose";

const adminSchema = Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    match: /.+\@.+\..+/,
  },
  password: {
    type: String,
    min: 8,
    required: true,
  },
  phoneNumber: {
    type: Number,
  },
  companyName: {
    type: String,
  },
  address: {
    type: String,
  },
  pincode: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
  },
  pancardNumber: {
    type: String,
  },
  gstNumber: {
    type: String,
  },
  license: {
    type: String,
  },
  verification: {
    type: String,
    enum: ["Not Verified", "Verification Pending", "Verified"],
    default: "Not Verified",
    required: true,
  },
  Domain: {
    type: String,
    enum: ["Bus", "Flight", "Hotel"],
    required: true,
  },
});

export const Admin = model("Admin", adminSchema);
