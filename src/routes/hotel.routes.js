import { Router } from "express";
import {
  createHotel,
  createRoom,
  deleteRoomData,
  getActiveHotelData,
  getSingleHotelData,
  updateHotelData,
  updateRoomData,
} from "../controllers/hotel.controller.js";
import { authenticate } from "../middleware/authenticate.js";

export const hotelRouter = Router();

// Hotel Registration // about hotel // Admin can have only one hotel
hotelRouter.post("/create", authenticate("admin"), createHotel);
// Create room for hotels
hotelRouter.post("/create-room", authenticate("admin"), createRoom);
hotelRouter.delete("/delete/:id", authenticate("admin"), deleteRoomData);
hotelRouter.put("/update", authenticate("admin"), updateRoomData);

// For user
hotelRouter.post("/active-hotels", getActiveHotelData);
hotelRouter.get("/:id", getSingleHotelData);

// Hotel Data Update
hotelRouter.put("/update", authenticate("admin"), updateHotelData);
