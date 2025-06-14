import { Bus } from "../models/bus.models.js";
import { Flight } from "../models/flight.models.js";
import { Hotel } from "../models/hotel.models.js";

export async function fetchEvents(req, res) {
  try {
    const flights = await Flight.find().limit(8);
    const buses = await Bus.find().limit(8);
    const hotels = await Hotel.find().limit(8);

    res.status(200).json({
      flights,
      buses,
      hotels,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getInfoById(req, res) {
  const { id } = req.params;
  try {
    const hotel = await Hotel.findById({ _id: id });
    if (hotel) {
      return res.status(200).json({ type: "hotel", data: hotel });
    }
    const bus = await Bus.findById({ _id: id });
    if (bus) {
      return res.status(200).json({ type: "bus", data: bus });
    }
    const flight = await Flight.findById({ _id: id });
    if (flight) {
      return res.status(200).json({ type: "flight", data: flight });
    }

    return res.status(404).json({ success: false, message: "Item not found" });
  } catch (error) {
    console.log("Error fetching data ::::", error);
    return { success: false, message: "Internal Server Error" };
  }
}
