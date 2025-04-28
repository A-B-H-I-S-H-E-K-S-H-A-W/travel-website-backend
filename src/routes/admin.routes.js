import { Router } from "express";
import {
  adminprofile,
  loginadmin,
  registeradmin,
} from "../controllers/admin.controller.js";
import { isAdminAuthenticated } from "../middleware/adminAuthMiddleware.js";

export const adminRouter = Router();

adminRouter.post("/register", registeradmin);
adminRouter.post("/auth", loginadmin);
adminRouter.get("/profile", isAdminAuthenticated, adminprofile);
