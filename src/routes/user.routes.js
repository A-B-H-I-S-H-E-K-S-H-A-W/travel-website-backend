import { Router } from "express";
import { userAPI } from "../controllers/user.controller.js";

export const router = Router();

// // Auth routes
// router.post("/auth", userAPI.loginusers);
// router.post("/register", userAPI.registerusers);

// // User data routes
router.get("/:id", userAPI.getuser);
