import { Router } from "express";
import {
  adminprofile,
  loginadmin,
  registeradmin,
  updateadmin,
} from "../controllers/admin.controller.js";
import { isAdminAuthenticated } from "../middleware/adminAuthMiddleware.js";

export const adminRouter = Router();

adminRouter.post("/register", registeradmin);
adminRouter.post("/auth", loginadmin);
adminRouter.get("/profile", isAdminAuthenticated, adminprofile);
adminRouter.post("/update", isAdminAuthenticated, updateadmin);
