import { Router } from "express";
import {
  loginSuperAdmin,
  registerSuperAdmin,
} from "../controllers/superadmin.controller.js";

export const superAdminRouter = Router();

superAdminRouter.post("/register-once", registerSuperAdmin);
superAdminRouter.post("/auth", loginSuperAdmin);
