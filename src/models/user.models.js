import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    avatar: {
      type: String,
    },
    phoneNumber: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
