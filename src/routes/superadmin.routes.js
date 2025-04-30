import { Router } from "express";
import {
  getSuperAdminProfile,
  loginSuperAdmin,
  newSuperAdmin,
  registerSuperAdmin,
} from "../controllers/superadmin.controller.js";

export const superAdminRouter = Router();

superAdminRouter.post("/register-once", registerSuperAdmin);
superAdminRouter.post("/auth", loginSuperAdmin);
superAdminRouter.post("/new-registration", newSuperAdmin);
superAdminRouter.get("/get-super-admins", getSuperAdminProfile);
