import { Admin } from "../models/admin.models.js";
import { Hotel, Room } from "../models/hotel.models.js";
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

      const existingHotel = await Hotel.findOne({ name });
      if (existingHotel) {
        return res.json({
          success: false,
          message: "Hotel with this name already exists",
        });
      }

      const imageFiles = req.files?.images;
      let imagePath = [];

      if (!imageFiles) {
        return res
          .status(400)
          .json({ success: false, message: "No images uploaded" });
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
        success: true,
        message: "Hotel created successfully",
      });
    } else {
      console.log("Owner is not verified or domain doesn't match");
      res.status(403).json({
        success: false,
        message: "Owner is not verified or domain doesn't match",
      });
    }
  } catch (error) {
    console.log("Can't create Hotel Data", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export const getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find(); // You can add filters like .find({ city: req.query.city })
    res.status(200).json({ success: true, data: hotels });
  } catch (error) {
    console.error("Error fetching hotels:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getAllAdminHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find({ owner: req.user.id }); // assuming owner = admin's ID
    res.status(200).json({ success: true, data: hotels });
  } catch (error) {
    console.error("Error fetching hotels:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Create room

export async function createRoom(req, res) {
  try {
    const owner = await Admin.findById({ _id: req.user.id }).select(
      "-password"
    );

    if (owner.verification === "Verified" && owner.domain === "Hotel") {
      const {
        hotel,
        bedType,
        maxPerson,
        facilities,
        discount,
        price,
        payment,
        booked,
        totalRooms,
      } = req.body;
      const imageFiles = req.files?.images;
      let imagePath = [];

      if (!imageFiles) {
        return res
          .status(400)
          .json({ success: false, message: "No images uploaded" });
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

      const finalAmount = price - price * (discount / 100);

      if (!hotel) {
        return res
          .status(404)
          .json({ success: false, message: "Hotel not found for this owner" });
      }

      const newRoom = new Room({
        hotel: hotel,
        bedType,
        maxPerson: parseInt(maxPerson),
        price: parseFloat(price),
        discount: parseFloat(discount),
        facilities,
        discountedAmount: finalAmount,
        payment,
        booked,
        totalRooms: parseInt(totalRooms),
        images: imagePath,
      });
      await newRoom.save();
      res.status(201).json({ success: true, message: "Room created" });
    } else {
      console.log("Owner is not verified or domain dosen't matched");
      res.status(404).json({
        success: false,
        message: "Owner is not verified or domain dosen't matched",
      });
    }
  } catch (error) {
    console.log("Cant create Room Data", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function fetchAdminRoomData(req, res) {
  try {
    const hotels = await Hotel.find({ owner: req.user.id });

    if (!hotels || hotels.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No hotels found for this admin" });
    }

    const hotelIds = hotels.map((h) => h._id);

    const rooms = await Room.find({ hotel: { $in: hotelIds } }).populate(
      "hotel"
    );

    if (!rooms || rooms.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No rooms found for this admin's hotels",
      });
    }

    res.status(200).json({ success: true, data: rooms });
  } catch (error) {
    console.error("Can't fetch Room Data", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// Delete Room

export async function deleteRoomData(req, res) {
  try {
    const roomId = req.params.id;

    const room = await Room.findById(roomId);

    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: "Room data not found" });
    }

    const images = room.images;
    UnlinkFile(images);

    await Room.findByIdAndDelete(roomId);

    res.status(200).json({ success: true, message: "Deleted room data" });
  } catch (error) {
    console.log("Cant delete Room Data");
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// Update Room

export async function updateRoomData(req, res) {
  try {
    const {
      hotel,
      bedType,
      maxPerson,
      facilities,
      discount,
      price,
      payment,
      booked,
      totalRooms,
    } = req.body;

    const imageFile = req.files?.images;
    const room = await Room.findById(req.body._id);
    let imagePath = room.images;

    if (!room) {
      return res
        .status(400)
        .json({ success: false, message: "Room not found" });
    }

    if (imageFile) {
      UnlinkFile(room.image);
      imagePath = await FileUploader(imageFile);
    }

    const finalAmount = price - price * (discount / 100);

    const updateRoom = {
      hotel,
      bedType,
      maxPerson,
      facilities,
      discount,
      price,
      discountedAmount: finalAmount,
      payment,
      booked,
      totalRooms,
      images: imagePath,
    };
    await Room.findByIdAndUpdate(req.body._id, updateRoom, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({ success: true, message: "Room updated" });
  } catch (error) {
    console.log("Cant update Room Data");
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// Read Hotel and Rooms Data
export async function getSingleHotelData(req, res) {
  try {
    const hotelId = req.params.id;
    const hotel = await Hotel.findById(hotelId).populate("owner", "-password");

    if (!hotel) {
      return res.status(400).json({ message: "Hotel not found" });
    }
    const room = await Room.find({ hotel: hotelId });
    res.status(200).json({ data: hotel, room: room });
  } catch (error) {
    console.log("Error fetching hotel data ::::", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Hotel data which is active
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

//Update Hotel Data
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
    const hotelId = req.params.id;

    const imageFiles = req.files?.images;

    const hotel = await Hotel.findById(hotelId);
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
      success: true,
      message: "Hotel successfully updated",
      hotel: updatedhotel,
    });
  } catch (error) {
    console.log("Error updating hotel data ::::", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Hotel Data

export const deleteHotelById = async (req, res) => {
  const hotelId = req.params.id;

  try {
    const deletedHotel = await Hotel.findByIdAndDelete(hotelId);

    if (!deletedHotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Hotel deleted successfully",
      data: deletedHotel,
    });
  } catch (error) {
    console.error("Error deleting hotel:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
