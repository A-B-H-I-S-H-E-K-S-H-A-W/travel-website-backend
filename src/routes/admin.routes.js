import { Router } from "express";
import {
  adminprofile,
  loginadmin,
  registeradmin,
  updateadmin,
} from "../controllers/admin.controller.js";
import { authenticate } from "../middleware/authenticate.js";

export const adminRouter = Router();

adminRouter.post("/register", registeradmin);
adminRouter.post("/auth", loginadmin);
adminRouter.get("/profile", authenticate("admin"), adminprofile);
adminRouter.post("/update", authenticate("admin"), updateadmin);
