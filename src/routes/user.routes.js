import { Router } from "express";
import {
  
  loginuser,
  registeruser,
} from "../controllers/user.controller.js";

export const userRouter = Router();

userRouter.post("/auth", loginuser);
userRouter.post("/register", registeruser);
// userRouter.get("/:id", getuser);
