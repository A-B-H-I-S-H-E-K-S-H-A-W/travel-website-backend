import { Schema, model } from "mongoose";

const superAdminSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /.+\@.+\..+/,
      lowercase: true,
    },
    password: {
      type: String,
      min: 8,
    },
    loginCode: {
      type: String,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

export const SuperAdmin = model("SuperAdmin", superAdminSchema);
