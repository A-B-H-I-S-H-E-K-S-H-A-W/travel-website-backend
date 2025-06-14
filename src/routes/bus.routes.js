import { Router } from "express";
import {
  createBus,
  deleteBusData,
  getActiveBusData,
  getAllBusData,
  getBusData,
  getSingleBusData,
  updateBusData,
} from "../controllers/bus.controller.js";
import { authenticate } from "../middleware/authenticate.js";

export const busRouter = Router();

busRouter.post("/create", authenticate("admin"), createBus);
busRouter.get("/buses", authenticate("admin"), getBusData);
busRouter.post("/active-buses", getActiveBusData);
busRouter.get("/all-buses", authenticate("user"), getAllBusData);
busRouter.get("/:id", getSingleBusData);
busRouter.delete("/delete/:id", authenticate("admin"), deleteBusData);
busRouter.put("/update/:id", authenticate("admin"), updateBusData);
