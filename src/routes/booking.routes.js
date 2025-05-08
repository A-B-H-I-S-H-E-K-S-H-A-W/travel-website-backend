import { Router } from "express";
import { Booking } from "../models/booking.models";
import { authenticate } from "../middleware/authenticate";

export const bookingRouter = Router();

bookingRouter.post("/book", authenticate("user"), Booking);
