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
    loginCodes: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export const SuperAdmin = model("SuperAdmin", superAdminSchema);
