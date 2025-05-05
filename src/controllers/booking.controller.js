import { Bus } from "../models/bus.models";

export async function booking(req, res) {
  try {
  } catch (error) {
    console.log("Error at booking ::::", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
