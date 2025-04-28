import { Admin } from "../models/admin.models.js";
import Decrypt from "../utils/Decrypt.js";
import Encrypt from "../utils/Encrypt.js";
import jwt from "jsonwebtoken";

export async function registeradmin(req, res) {
  try {
    const { username, email, password, domain } = req.body;

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Admin already exists, Please login !" });
    }

    const hashedPassword = await Encrypt(password);

    const newAdmin = new Admin({
      username,
      email,
      domain,
      password: hashedPassword,
    });

    await newAdmin.save();
    res.status(201).json({ message: "Admin successfully registered" });
  } catch (error) {
    console.log("Admin registration error ::::", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function loginadmin(req, res) {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ message: "User dosen't exists" });
    }

    await Decrypt(password, admin.password)
      .then((isMatch) => {
        if (isMatch) {
          const token = jwt.sign(
            { id: admin._id },
            process.env.ADMIN_JWT_SECRET,
            {
              expiresIn: process.env.ADMIN_JWT_EXPIRE,
            }
          );

          res.status(200).json({
            message: "Login Successfully",
            token,
            admin: {
              id: admin._id,
              username: admin.username,
              email: admin.email,
              domain: admin.domain,
            },
          });
        } else {
          res.status(400).json({ message: "Login Failed, Password Incorrect" });
        }
      })
      .catch((error) => {
        console.log("Error during password decryption ::::", error);
        res.status(500).json({ message: "Server Error" });
      });
  } catch (error) {
    console.log("ERROR CREATING USER :::", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function adminprofile(req, res) {
  try {
    const admin = await Admin.findOne({ _id: req.user.id }).select("-password");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({
      id: admin._id,
      username: admin.username, // work starts from here...
    });
  } catch (error) {
    console.log("Error fetching admin data ::::", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
