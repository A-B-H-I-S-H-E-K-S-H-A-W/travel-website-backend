import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import {
  createFlight,
  deleteFlightData,
  getActiveFlightData,
  getFlightData,
  getSingleFlightData,
  updateFlightData,
} from "../controllers/flight.controller.js";

export const flightRouter = Router();

flightRouter.post("/create", authenticate("admin"), createFlight);
flightRouter.get("/list", authenticate("admin"), getFlightData);
flightRouter.get("/:id", getSingleFlightData);
flightRouter.post("/active-flights", getActiveFlightData);
flightRouter.delete("/delete/:id", authenticate("admin"), deleteFlightData);
flightRouter.put("/update/:id", authenticate("admin"), updateFlightData);
