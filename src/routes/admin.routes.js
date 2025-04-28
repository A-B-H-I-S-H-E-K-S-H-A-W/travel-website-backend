import { Router } from "express";
import { loginadmin, registeradmin } from "../controllers/admin.controller.js";

export const adminRouter = Router();

adminRouter.get("/", (req, res) => {
  res.send("Hello");
});

adminRouter.post("/register", registeradmin);
adminRouter.post("/auth", loginadmin);
