import { SuperAdmin } from "../models/superadmin.models.js";
import Encrypt from "../utils/Encrypt.js";
import Decrypt from "../utils/Decrypt.js";
import jwt from "jsonwebtoken";

export async function registerSuperAdmin(req, res) {
  try {
    const superAdmin = {
      username: process.env.SUPERADMIN_USERNAME,
      email: process.env.SUPERADMIN_EMAIL,
      password: process.env.SUPERADMIN_PASSWORD,
      loginCode: process.env.SUPERADMIN_LOGINCODE,
    };

    const existingSuperAdmin = await SuperAdmin.findOne({
      email: superAdmin.email,
    });

    if (!existingSuperAdmin) {
      const hashedPassword = await Encrypt(superAdmin.password);

      const newSuperAdmin = new SuperAdmin({
        username: superAdmin.username,
        email: superAdmin.email,
        password: hashedPassword,
        loginCode: superAdmin.loginCode,
      });

      await newSuperAdmin.save();
      res.status(201).json({ message: "Successfully registered Super Admin" });
    }
  } catch (error) {
    console.log("ERROR REGISTERING SUPER ADMIN ::::", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function loginSuperAdmin(req, res) {
  try {
    const { email, password, loginCode } = req.body;

    const superadmin = await SuperAdmin.findOne({
      email,
    });

    if (!superadmin) {
      return res
        .status(400)
        .json({ success: false, message: "Super Admin doesn't exist" });
    }

    const isPasswordMatch = await Decrypt(password, superadmin.password);
    const isCodeMatch = loginCode === superadmin.loginCode;

    if (!isPasswordMatch || !isCodeMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password or login code",
      });
    }

    const token = jwt.sign(
      { id: superadmin._id },
      process.env.SUPERADMIN_JWT_SECRET,
      { expiresIn: process.env.SUPERADMIN_JWT_EXPIRE }
    );

    const safeAdmin = {
      email: superadmin.email,
      username: superadmin.username,
    };

    res.status(200).json({
      success: true,
      message: "Super Admin successfully logged in",
      token,
      superadmin: safeAdmin,
    });
  } catch (error) {
    console.log("CAN'T LOGIN ::::", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function superAdminLogout(req, res) {
  res.status(200).json({ success: true, message: "Logged out successfully" });
}

export async function newSuperAdmin(req, res) {
  try {
    const { username, email, password, loginCode } = req.body;

    const existingSuperAdmin = await SuperAdmin.findOne({
      email,
    });

    if (existingSuperAdmin) {
      return res
        .status(400)
        .json({ success: false, message: "Super Admin already exists" });
    }

    const hashedPassword = await Encrypt(password);

    const newSuperAdmin = new SuperAdmin({
      username,
      email,
      password: hashedPassword,
      loginCode: loginCode,
    });

    await newSuperAdmin.save();

    res.status(201).json({
      success: true,
      message: "Super Admin successfully created",
    });
  } catch (error) {
    console.log("Error adding new super admin ::::", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getSuperAdminProfile(req, res) {
  try {
    const superAdmins = await SuperAdmin.find();
    res.status(200).json(superAdmins);
  } catch (error) {
    console.log("Error getting Super Admin data ::::", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function superAdminProfile(req, res) {
  try {
    const id = req.user.id;
    const superAdmins = await SuperAdmin.findById(id);
    res.status(200).json(superAdmins);
  } catch (error) {
    console.log("Error getting Super Admin data ::::", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const superAdminRemove = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    const deleteAdmin = await SuperAdmin.findByIdAndDelete(id);

    if (!deleteAdmin) {
      return res.status(404).json({ message: "Super Admin not found" });
    }

    res.status(200).json({ success: true, message: "Super Admin Deleted" });
  } catch (error) {
    console.log("Error removing Super Admin data ::::", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
