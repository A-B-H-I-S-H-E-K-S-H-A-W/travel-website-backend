import { Router } from "express";
import { userAPI } from "../controllers/user.controller.js";

export const router = Router();

router.get("/", userAPI.getusers);
