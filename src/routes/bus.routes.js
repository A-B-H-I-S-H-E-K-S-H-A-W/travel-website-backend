import { Router } from "express";
import { createBus } from "../controllers/bus.controller";

export const busRouter = Router();

busRouter.post("/create", createBus);
