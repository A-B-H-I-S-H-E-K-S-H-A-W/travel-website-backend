import { Booking } from "../models/booking.models.js";
import { Bus } from "../models/bus.models.js";
import { Flight } from "../models/flight.models.js";
import { Hotel } from "../models/hotel.models.js"; // Assuming you have this

export async function booking(req, res) {
  try {
    const { travelDate, bus, hotel, flight } = req.body;
    const userId = req.user.id;

    const bookingTypes = [bus, hotel, flight].filter(Boolean);
    if (bookingTypes.length !== 1) {
      return res
        .status(400)
        .json({ message: "Choose only one domain to book" });
    }

    const existingBooking = await Booking.findOne({
      travelDate: new Date(travelDate),
      ...(bus && { bus }),
      ...(hotel && { hotel }),
      ...(flight && { flight }),
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "This item is already booked on the selected date.",
      });
    }

    // Bus logic
    if (bus) {
      const busData = await Bus.findById(bus);
      if (!busData) {
        return res
          .status(404)
          .json({ success: false, message: "Bus not found" });
      }

      if (busData.availableSeats <= 0) {
        return res
          .status(400)
          .json({ success: false, message: "No seats available on this bus" });
      }

      busData.availableSeats -= 1;
      await busData.save();
    }

    // Flight logic
    if (flight) {
      const flightData = await Flight.findById(flight);
      if (!flightData) {
        return res
          .status(404)
          .json({ success: false, message: "Flight not found" });
      }

      if (flightData.availableSeats <= 0) {
        return res.status(400).json({
          success: false,
          message: "No seats available on this flight",
        });
      }

      flightData.availableSeats -= 1;
      await flightData.save();
    }

    // Hotel logic (completely unavailable after booking on a date)
    if (hotel) {
      const hotelData = await Hotel.findById(hotel);
      if (!hotelData) {
        return res
          .status(404)
          .json({ success: false, message: "Hotel not found" });
      }

      // Optionally: Add a boolean to mark as booked if you want
      // For now, just relying on Booking collection check above
    }

    const newBooking = new Booking({
      user: userId,
      travelDate: new Date(travelDate),
      bus: bus || null,
      hotel: hotel || null,
      flight: flight || null,
    });

    await newBooking.save();

    res.status(201).json({ success: true, message: "Booking completed" });
  } catch (error) {
    console.error("Error at booking ::::", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export const getUserBookings = async (req, res) => {
  try {
    const userId = req.params.id;

    const bookings = await Booking.find({ user: userId })
      .populate("bus")
      .populate("hotel")
      .populate("flight")
      .sort({ travelDate: -1 });

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    console.error("Error fetching bookings by ID:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteBookingById = async (req, res) => {
  try {
    const bookingId = req.params.id;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    await Booking.findByIdAndDelete(bookingId);
    return res
      .status(200)
      .json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    const bookingId = req.params.id;
    console.log(bookingId);

    console.error("Delete booking error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
