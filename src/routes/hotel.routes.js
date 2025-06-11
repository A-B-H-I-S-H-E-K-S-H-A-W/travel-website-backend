import { Router } from "express";
import {
  createHotel,
  createRoom,
  deleteHotelById,
  deleteRoomData,
  getActiveHotelData,
  getAllHotels,
  getSingleHotelData,
  updateHotelData,
  updateRoomData,
} from "../controllers/hotel.controller.js";
import { authenticate } from "../middleware/authenticate.js";

export const hotelRouter = Router();

// Hotel Registration // about hotel
hotelRouter.post("/create", authenticate("admin"), createHotel);
hotelRouter.get("/list", authenticate("admin"), getAllHotels);
// Create room for hotels
hotelRouter.post("/create-room", authenticate("admin"), createRoom);
hotelRouter.delete("/delete/delete/:id", authenticate("admin"), deleteRoomData);
hotelRouter.put("/room/update/:id", authenticate("admin"), updateRoomData);

// For user
hotelRouter.post("/active-hotels", getActiveHotelData);
hotelRouter.get("/:id", getSingleHotelData);

// Hotel Data Update
hotelRouter.put("/update/:id", authenticate("admin"), updateHotelData);
hotelRouter.delete("/delete/:id", authenticate("admin"), deleteHotelById);
