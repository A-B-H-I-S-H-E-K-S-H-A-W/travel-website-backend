import { Hotel } from "../models/hotel.models.js";

export async function createHotel(req, res) {
  try {
    res.send("Hello World");
  } catch (error) {
    console.log("Something went wrong");
  }
}
