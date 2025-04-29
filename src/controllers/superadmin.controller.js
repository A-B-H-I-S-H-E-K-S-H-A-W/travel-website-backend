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
      loginCodes: [process.env.SUPERADMIN_LOGINCODE],
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
        loginCodes: superAdmin.loginCodes,
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
      loginCodes: loginCode,
    });

    if (!superadmin) {
      return res.status(400).json({ message: "Super Admin doesn't exist" });
    }

    const isMatch = await Decrypt(password, superadmin.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
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
      message: "Super Admin successfully logged in",
      token,
      superadmin: safeAdmin,
    });
  } catch (error) {
    console.log("CAN'T LOGIN ::::", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
