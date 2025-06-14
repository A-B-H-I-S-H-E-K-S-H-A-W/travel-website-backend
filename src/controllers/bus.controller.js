import { Admin } from "../models/admin.models.js";
import { Bus } from "../models/bus.models.js";
import FileUploader from "../utils/FileUploader.js";
import UnlinkFile from "../utils/UnlinkFile.js";
import { duration } from "../utils/Duration.js";

export async function createBus(req, res) {
  try {
    const owner = await Admin.findOne({ _id: req.user.id }).select("-password");

    if (owner.verification === "Verified" && owner.domain === "Bus") {
      const {
        busNumber,
        busName,
        source,
        destination,
        departureTime,
        arrivalTime,
        totalSeats,
        fare,
        busType,
        operatingDays,
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

      const availableBusSeats = totalSeats;

      const totalDuration = duration(departureTime, arrivalTime);
      console.log(totalDuration);

      const newBus = await Bus.create({
        owner: owner._id,
        busNumber,
        busName,
        source,
        destination,
        departureTime,
        arrivalTime,
        duration: totalDuration,
        totalSeats,
        availableSeats: availableBusSeats,
        images: imagePath,
        fare,
        busType,
        operatingDays,
        isActive,
      });

      await newBus.save();

      res.status(201).json({
        success: true,
        message: "Bus scheduled successfully",
      });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Admin is not verified" });
    }
  } catch (error) {
    console.log("Error creating bus schedule ::::", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function getBusData(req, res) {
  try {
    const buses = await Bus.find({ owner: req.user.id }).populate(
      "owner",
      "-password"
    );

    if (buses.length === 0) {
      return res.status(400).json({ message: "No bus data found" });
    }

    res.status(200).json({ success: true, data: buses });
  } catch (error) {
    console.log("Error fetching bus data ::::", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getSingleBusData(req, res) {
  try {
    const busId = req.params.id;
    const bus = await Bus.findById(busId).populate("owner", "-password");

    if (!bus) {
      return res.status(400).json({ success: false, message: "Bus not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Fetched Bus data", data: bus });
  } catch (error) {
    console.log("Error fetching bus data ::::", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function getActiveBusData(req, res) {
  try {
    const isActive = req.body.isActive;

    const buses = await Bus.find({ isActive: isActive }).populate(
      "owner",
      "-password"
    );

    if (buses.length === 0) {
      return res.status(400).json({ message: "No bus data found" });
    }

    res.status(200).json(buses);
  } catch (error) {
    console.log("Error fetching bus data ::::", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getAllBusData(req, res) {
  try {
    const buses = await Bus.find().populate("owner", "-password");

    if (buses.length === 0) {
      return res.status(400).json({ message: "No bus data found" });
    }

    res.status(200).json(buses);
  } catch (error) {
    console.log("Error fetching bus data ::::", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteBusData(req, res) {
  try {
    const busId = req.params.id;

    const bus = await Bus.findById({ _id: busId });

    if (!bus) {
      return res
        .status(404)
        .json({ success: false, message: "Sheduled bus not found" });
    }

    for (const image of bus.images) {
      try {
        UnlinkFile(image);
      } catch (error) {
        console.log("Image not found");
        res.status(400);
      }
    }

    await Bus.findByIdAndDelete(busId);

    res.status(200).json({ success: true, message: "Deleted bus schedule" });
  } catch (error) {
    console.log("Error deleting bus data ::::", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function updateBusData(req, res) {
  try {
    const {
      busNumber,
      busName,
      source,
      destination,
      departureTime,
      arrivalTime,
      totalSeats,
      fare,
      busType,
      operatingDays,
      isActive,
    } = req.body;

    const imageFiles = req.files?.images;

    const busId = req.params.id;

    const bus = await Bus.findById({ _id: busId });
    if (!bus) {
      return res.status(404).json({ success: false, message: "Bus not found" });
    }

    const imagePath = [];

    if (imageFiles) {
      for (const img of bus.images) {
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

    const updateBus = {
      busNumber,
      busName,
      source,
      destination,
      departureTime,
      arrivalTime,
      duration: totalDuration,
      totalSeats,
      images: imagePath.length ? imagePath : bus.images,
      fare,
      busType,
      operatingDays,
      isActive,
    };

    const updatedBus = await Bus.findByIdAndUpdate(req.body._id, updateBus, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Bus schedule successfully updated",
    });
  } catch (error) {
    console.log("Error updating bus data ::::", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
