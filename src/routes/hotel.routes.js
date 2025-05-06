import { Router } from "express";
import { createHotel } from "../controllers/hotel.controller.js";

export const hotelRouter = Router();

hotelRouter.get("/", createHotel);
