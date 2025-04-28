import { Router } from "express";
import {
  getuser,
  loginuser,
  registeruser,
  updateuser,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

export const userRouter = Router();

userRouter.post("/auth", loginuser);
userRouter.post("/register", registeruser);
userRouter.get("/:id", isAuthenticated, getuser);
userRouter.post("/update", isAuthenticated, updateuser);
