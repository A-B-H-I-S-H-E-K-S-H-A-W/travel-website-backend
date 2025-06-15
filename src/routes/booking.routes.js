import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { booking, getUserBookings } from "../controllers/booking.controller.js";

export const bookingRouter = Router();

bookingRouter.post("/book", authenticate("user"), booking);
bookingRouter.get("/my-booking/:id", authenticate("user"), getUserBookings);
