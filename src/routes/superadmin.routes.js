import { Router } from "express";
import {
  getSuperAdminProfile,
  loginSuperAdmin,
  newSuperAdmin,
  registerSuperAdmin,
} from "../controllers/superadmin.controller.js";
import { authenticate } from "../middleware/authenticate.js";

export const superAdminRouter = Router();

superAdminRouter.post("/register-once", registerSuperAdmin);
superAdminRouter.post("/auth", loginSuperAdmin);
superAdminRouter.post(
  "/new-registration",
  authenticate("superadmin"),
  newSuperAdmin
);
superAdminRouter.get(
  "/get-super-admins",
  authenticate("superadmin"),
  getSuperAdminProfile
);
