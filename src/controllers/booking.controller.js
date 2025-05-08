import { Booking } from "../models/booking.models";
import { Bus } from "../models/bus.models.js";
import { Flight } from "../models/flight.models.js";

export async function booking(req, res) {
  try {
    const { bus, hotel, flight } = req.body;

    const bookingTypes = [bus, hotel, flight].filter(Boolean);
    if (bookingTypes.length !== 1) {
      return res.status(400).json({ message: "Chosen wrong domain" });
    }

    let availableSeats = 0;
    if (bus) {
      const busData = await Bus.findById(bus);

      if (!busData) {
        return res.status(404).json({ message: "Bus not found" });
      }

      if (busData.availableSeats <= 0) {
        return res
          .status(400)
          .json({ message: "No available seats on this bus" });
      }
      const updatedSeats = busData.availableSeats - 1;

      await Bus.findByIdAndUpdate(bus, { availableSeats: updatedSeats });

      console.log(`Seat booked. Remaining seats: ${updatedSeats}`);
    }

    if (flight) {
      const flightData = await Flight.findById(flight);

      if (!flightData) {
        return res.status(404).json({ message: "Flight not found" });
      }

      if (flightData.availableSeats <= 0) {
        return res
          .status(400)
          .json({ message: "No available seats on this Flight" });
      }
      const updatedSeats = flightData.availableSeats - 1;

      await Flight.findByIdAndUpdate(flight, { availableSeats: updatedSeats });
      console.log(`Seat booked. Remaining seats: ${updatedSeats}`);
    }

    if (!user || !travelDate) {
      return res
        .status(400)
        .json({ message: "User and travelDate are required" });
    }

    const newBooking = new Booking({
      user: req.user.id,
      travelDate,
      bus: bus || null,
      hotel: hotel || null,
      flight: flight || null,
    });

    await newBooking.save();
    res.status(201).json({ message: "Booking Done" });
  } catch (error) {
    console.log("Error at booking ::::", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
