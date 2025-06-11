import { Router } from "express";
import {
  getSuperAdminProfile,
  loginSuperAdmin,
  newSuperAdmin,
  registerSuperAdmin,
  superAdminLogout,
  superAdminProfile,
  superAdminRemove,
} from "../controllers/superadmin.controller.js";
import { authenticate } from "../middleware/authenticate.js";

export const superAdminRouter = Router();

superAdminRouter.post("/register-once", registerSuperAdmin);
superAdminRouter.post("/auth", loginSuperAdmin);
superAdminRouter.post("/logout", authenticate("superadmin"), superAdminLogout);
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

superAdminRouter.get("/profile", authenticate("superadmin"), superAdminProfile);
superAdminRouter.post("/remove", authenticate("superadmin"), superAdminRemove);
