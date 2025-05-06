import { Router } from "express";
import {
  createHotel,
  deleteHotelData,
  getActiveHotelData,
  getHotelData,
  getSingleHotelData,
  updateHotelData,
} from "../controllers/hotel.controller.js";
import { authenticate } from "../middleware/authenticate.js";

export const hotelRouter = Router();

hotelRouter.post("/create", authenticate("admin"), createHotel);
hotelRouter.get("/hotels", authenticate("admin"), getHotelData);
hotelRouter.post("/active-hotels", getActiveHotelData);
hotelRouter.get("/:id", getSingleHotelData);
hotelRouter.delete("/delete/:id", authenticate("admin"), deleteHotelData);
hotelRouter.put("/update", authenticate("admin"), updateHotelData);
