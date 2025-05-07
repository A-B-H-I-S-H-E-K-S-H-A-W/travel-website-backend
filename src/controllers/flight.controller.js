import { Admin } from "../models/admin.models.js";
import { Flight } from "../models/flight.models.js";
import { duration } from "../utils/Duration.js";
import FileUploader from "../utils/FileUploader.js";
import UnlinkFile from "../utils/UnlinkFile.js";

export async function createFlight(req, res) {
  try {
    const owner = await Admin.findOne({ _id: req.user.id }).select("-password");

    if (owner.verification === "Not Verified" && owner.domain === "Flight") {
      const {
        flightNumber,
        airline,
        aircraftType,
        departureCity,
        arrivalCity,
        departureAirport,
        arrivalAirport,
        departureTime,
        arrivalTime,
        classType,
        totalSeats,
        mealIncluded,
        price,
        discount,
        status,
        isActive,
      } = req.body;

      const imageFiles = req.files?.images;
      let imagePath = [];

      if (!imageFiles) {
        return res.status(400).json({ message: "No images uploaded" });
      }

      if (Array.isArray(imageFiles)) {
        for (const image of imageFiles) {
          const fileName = await FileUploader(image);
          imagePath.push(fileName);
        }
      } else {
        const fileName = await FileUploader(imageFiles);
        imagePath.push(fileName);
      }

      const availableFlightSeats = totalSeats;
      const finalAmount = price - price * (discount / 100);
      const totalDuration = duration(departureTime, arrivalTime);

      const newFlight = await Flight.create({
        owner: owner._id,
        flightNumber,
        airline,
        aircraftType,
        departureCity,
        arrivalCity,
        departureAirport,
        arrivalAirport,
        departureTime,
        arrivalTime,
        duration: totalDuration,
        classType,
        totalSeats,
        seatsAvailable: availableFlightSeats,
        mealIncluded,
        price,
        discount,
        finalAmount: finalAmount,
        status,
        images: imagePath,
        isActive,
      });

      await newFlight.save();

      res.status(201).json({
        message: "Flight scheduled successfully",
      });
    } else {
      res
        .status(404)
        .json({ message: "Admin is not verified or wrong domain" });
    }
  } catch (error) {
    console.log("Error creating flight schedule ::::", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getFlightData(req, res) {
  try {
    const flight = await Flight.find({ owner: req.user.id }).populate(
      "owner",
      "-password"
    );

    if (flight.length === 0) {
      return res.status(400).json({ message: "No flight data found" });
    }

    res.status(200).json(flight);
  } catch (error) {
    console.log("Error fetching flight data ::::", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getSingleFlightData(req, res) {
  try {
    const flightId = req.params.id;
    const flight = await Flight.findById(flightId).populate(
      "owner",
      "-password"
    );

    if (!flight) {
      return res.status(400).json({ message: "flight not found" });
    }

    res.status(200).json(flight);
  } catch (error) {
    console.log("Error fetching flight data ::::", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getActiveFlightData(req, res) {
  try {
    const isActive = req.body.isActive;

    const flight = await Flight.find({ isActive: isActive }).populate(
      "owner",
      "-password"
    );

    if (flight.length === 0) {
      return res.status(400).json({ message: "No flight data found" });
    }

    res.status(200).json(flight);
  } catch (error) {
    console.log("Error fetching flight data ::::", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteFlightData(req, res) {
  try {
    const flightId = req.params.id;

    const flight = await Flight.findById(flightId);

    if (!flight) {
      return res.status(404).json({ message: "Sheduled flight not found" });
    }

    for (const image of flight.images) {
      try {
        UnlinkFile(image);
      } catch (error) {
        console.log("Image not found");
        res.status(400);
      }
    }

    await Flight.findByIdAndDelete(flightId);

    res.status(200).json({ message: "Deleted flight schedule" });
  } catch (error) {
    console.log("Error deleting flight data ::::", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateFlightData(req, res) {
  try {
    const {
      flightNumber,
      airline,
      aircraftType,
      departureCity,
      arrivalCity,
      departureAirport,
      arrivalAirport,
      departureTime,
      arrivalTime,
      classType,
      totalSeats,
      mealIncluded,
      price,
      discount,
      status,
      isActive,
    } = req.body;

    const imageFiles = req.files?.images;

    const flight = await Flight.findById(req.body._id);
    if (!flight) {
      return res.status(404).json({ message: "flight not found" });
    }

    const imagePath = [];

    if (imageFiles) {
      for (const img of flight.images) {
        UnlinkFile(img);
      }
      if (Array.isArray(imageFiles)) {
        for (const image of imageFiles) {
          const fileName = await FileUploader(image);
          imagePath.push(fileName);
        }
      } else {
        const fileName = await FileUploader(imageFiles);
        imagePath.push(fileName);
      }
    }

    const totalDuration = duration(departureTime, arrivalTime);
    const finalAmount = price - price * (discount / 100);

    const updateflight = {
      flightNumber,
      airline,
      aircraftType,
      departureCity,
      arrivalCity,
      departureAirport,
      arrivalAirport,
      departureTime,
      arrivalTime,
      duration: totalDuration,
      classType,
      totalSeats,
      mealIncluded,
      price,
      discount,
      finalAmount: finalAmount,
      status,
      images: imagePath.length ? imagePath : flight.images,
      isActive,
    };

    await Flight.findByIdAndUpdate(req.body._id, updateflight, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "flight schedule successfully updated",
    });
  } catch (error) {
    console.log("Error updating flight data ::::", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
