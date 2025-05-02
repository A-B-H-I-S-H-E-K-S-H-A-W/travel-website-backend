import { Router } from "express";
import {
  createBus,
  deleteBusData,
  getActiveBusData,
  getBusData,
  getSingleBusData,
  updateBusData,
} from "../controllers/bus.controller";
import { authenticate } from "../middleware/authenticate";

export const busRouter = Router();

busRouter.post("/create", authenticate("admin"), createBus);
busRouter.get("/buses", authenticate("admin"), getBusData);
busRouter.post("/active-buses", getActiveBusData);
busRouter.post("/:id", getSingleBusData);
busRouter.delete("delete/:id", authenticate("admin"), deleteBusData);
busRouter.put("/update", authenticate("admin"), updateBusData);
