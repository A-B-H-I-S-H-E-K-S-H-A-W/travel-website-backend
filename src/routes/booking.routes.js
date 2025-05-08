import { Router } from "express";
import { Booking } from "../models/booking.models.js";
import { authenticate } from "../middleware/authenticate.js";

export const bookingRouter = Router();

bookingRouter.post("/book", authenticate("user"), Booking);
