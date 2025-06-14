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

export async function fetchSearchData(req, res) {
  try {
    let { source, destination, person } = req.body;

    if (!source || !destination) {
      return res
        .status(400)
        .json({ message: "Source and destination are required." });
    }

    const passengerCount = parseInt(person) || 1;
    const sourceNormalized = source.trim().toLowerCase();
    const destinationNormalized = destination.trim().toLowerCase();

    const flightResults = await Flight.find({
      departureCity: { $regex: new RegExp(`^${sourceNormalized}$`, "i") },
      arrivalCity: { $regex: new RegExp(`^${destinationNormalized}$`, "i") },
      availableSeats: { $gte: passengerCount },
      isActive: true,
    });

    const busResults = await Bus.find({
      source: { $regex: new RegExp(`^${sourceNormalized}$`, "i") },
      destination: { $regex: new RegExp(`^${destinationNormalized}$`, "i") },
      availableSeats: { $gte: passengerCount },
      isActive: true,
    });

    const hotelResults = await Hotel.find({
      city: { $regex: new RegExp(`^${sourceNormalized}$`, "i") },
      isActive: true,
    });

    return res.status(200).json({
      flights: flightResults,
      buses: busResults,
      hotels: hotelResults,
    });
  } catch (error) {
    console.error("Search error:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong during search." });
  }
}
