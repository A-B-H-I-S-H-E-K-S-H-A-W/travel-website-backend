import { Router } from "express";
import { userAPI } from "../controllers/user.controller.js";

export const router = Router();

// // Auth routes
router.post("/auth", userAPI.loginuser);
router.post("/register", userAPI.registeruser);

// // User data routes
router.get("/:id", userAPI.getuser);
