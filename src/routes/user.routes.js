import { Router } from "express";
import {
  getuser,
  loginuser,
  registeruser,
  updateuser,
  userLogout,
} from "../controllers/user.controller.js";
import { authenticate } from "../middleware/authenticate.js";

export const userRouter = Router();

userRouter.post("/auth", loginuser);
userRouter.post("/register", registeruser);
userRouter.get("/:id", authenticate("user"), getuser);
userRouter.put("/update/:id", authenticate("user"), updateuser);
userRouter.get("/logout", userLogout);
