import { Admin } from "../models/admin.models.js";
import { Hotel } from "../models/hotel.models.js";
import FileUploader from "../utils/FileUploader.js";
import UnlinkFile from "../utils/UnlinkFile.js";

export async function createHotel(req, res) {
  try {
    const owner = await Admin.findById({ _id: req.user.id }).select(
      "-password"
    );

    if (owner.verification === "Verified" && owner.domain === "Hotel") {
      const {
        name,
        description,
        category,
        highlight,
        address,
        landmark,
        city,
        state,
        country,
        pincode,
        checkInTime,
        checkOutTime,
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

      const newHotel = new Hotel({
        owner: owner._id,
        name,
        description,
        category,
        highlight,
        address,
        landmark,
        city,
        state,
        country,
        pincode,
        checkInTime,
        checkOutTime,
        images: imagePath,
        isActive,
      });

      await newHotel.save();
      res.status(201).json({
        message: "Hotel created successfully",
        hotel: newHotel,
        owner: owner,
      });
    } else {
      console.log("Owner is not verified or domain dosen't matched");
      res
        .status(404)
        .json({ message: "Owner is not verified or domain dosen't matched" });
    }
  } catch (error) {
    console.log("Cant create Hotel Data");
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getHotelData(req, res) {
  try {
    const hotels = await Hotel.find({ owner: req.user.id }).populate(
      "owner",
      "-password"
    );

    if (hotels.length === 0) {
      return res.status(400).json({ message: "No hotel data found" });
    }

    res.status(200).json(hotels);
  } catch (error) {
    console.log("Error fetching hotel data ::::", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getSingleHotelData(req, res) {
  try {
    const hotelId = req.params.id;
    const hotel = await Hotel.findById(hotelId).populate("owner", "-password");

    if (!hotel) {
      return res.status(400).json({ message: "Hotel not found" });
    }

    res.status(200).json(hotel);
  } catch (error) {
    console.log("Error fetching hotel data ::::", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getActiveHotelData(req, res) {
  try {
    const isActive = req.body.isActive;

    const hotels = await Hotel.find({ isActive: isActive }).populate(
      "owner",
      "-password"
    );

    if (hotels.length === 0) {
      return res.status(400).json({ message: "No hotel data found" });
    }

    res.status(200).json(hotels);
  } catch (error) {
    console.log("Error fetching hotel data ::::", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteHotelData(req, res) {
  try {
    const hotelId = req.params.id;

    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    for (const image of hotel.images) {
      try {
        UnlinkFile(image);
      } catch (error) {
        console.log("Image not found");
        res.status(400);
      }
    }

    await Hotel.findByIdAndDelete(hotelId);

    res.status(200).json({ message: "Deleted hotel" });
  } catch (error) {
    console.log("Error deleting hotel data ::::", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateHotelData(req, res) {
  try {
    const {
      name,
      description,
      category,
      highlight,
      address,
      landmark,
      city,
      state,
      country,
      pincode,
      checkInTime,
      checkOutTime,
      isActive,
    } = req.body;

    const imageFiles = req.files?.images;

    const hotel = await Hotel.findById(req.body._id);
    if (!hotel) {
      return res.status(404).json({ message: "hotel not found" });
    }

    const imagePath = [];

    if (imageFiles) {
      for (const img of hotel.images) {
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

    const updatehotel = {
      name,
      description,
      category,
      highlight,
      address,
      landmark,
      city,
      state,
      country,
      pincode,
      checkInTime,
      checkOutTime,
      images: imagePath.length ? imagePath : hotel.images,
      isActive,
    };

    const updatedhotel = await Hotel.findByIdAndUpdate(
      req.body._id,
      updatehotel,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      message: "Hotel successfully updated",
      hotel: updatedhotel,
    });
  } catch (error) {
    console.log("Error updating hotel data ::::", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
