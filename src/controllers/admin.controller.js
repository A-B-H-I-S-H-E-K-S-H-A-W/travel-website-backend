import { Admin } from "../models/admin.models.js";
import Decrypt from "../utils/Decrypt.js";
import Encrypt from "../utils/Encrypt.js";
import jwt from "jsonwebtoken";
import FileUploader from "../utils/FileUploader.js";

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
    res
      .status(201)
      .json({ success: true, message: "Admin successfully registered" });
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
            success: true,
            message: "Login Successfully",
            token,
            admin: {
              id: admin._id,
              username: admin.username,
              email: admin.email,
              domain: admin.domain,
              verification: admin.verification,
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

export async function adminLogout(req, res) {
  res.status(200).json({ success: true, message: "Logged out successfully" });
}

export async function adminprofile(req, res) {
  try {
    const id = req.user.id;
    const admin = await Admin.findOne({ _id: id }).select("-password");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({
      id: admin._id,
      verification: admin.verification,
      username: admin.username,
      email: admin.email,
      phoneNumber: admin.phoneNumber,
      companyName: admin.companyName,
      address: admin.address,
      pincode: admin.pincode,
      city: admin.city,
      state: admin.state,
      country: admin.country,
      pancardNumber: admin.pancardNumber,
      gstNumber: admin.gstNumber,
      domain: admin.domain,
    });
  } catch (error) {
    console.log("Error fetching admin data ::::", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateadmin(req, res) {
  try {
    const {
      username,
      email,
      phoneNumber,
      companyName,
      address,
      pincode,
      city,
      state,
      country,
      pancardNumber,
      gstNumber,
    } = req.body;

    const updateAdmin = {
      username,
      email,
      phoneNumber,
      companyName,
      address,
      pincode,
      city,
      state,
      country,
      pancardNumber,
      gstNumber,
      verification: "Verification Pending",
    };

    const license = req.files?.license;

    if (license) {
      const uploadLicense = await FileUploader(license);
      updateAdmin.license = uploadLicense;
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.user.id,
      updateAdmin,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Admin successfully updated",
      admin: updatedAdmin,
    });
  } catch (error) {
    console.log("Can't update admin ::::", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function verification(req, res) {
  try {
    const { verification } = req.body;

    const admin = await Admin.find({ verification: verification }).select(
      "-password"
    );

    if (admin.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No Admin found" });
    }

    res.status(200).json({
      admin: admin,
      success: true,
      message: "Admin found",
    });
  } catch (error) {
    console.log("Can't find Data ::::", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function verificationUpdate(req, res) {
  try {
    const { verificationUpdate } = req.body;
    const id = req.user.id;

    const admin = await Admin.find({ _id: id }).select("-password");

    if (admin.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No Admin found" });
    }

    const updateAdmin = {
      verification: verificationUpdate,
    };

    const updatedAdmin = await Admin.findByIdAndUpdate(id, updateAdmin, {
      new: true,
      runValidators: true,
    }).select("-password");

    return res.status(200).json({
      success: true,
      message: "Admin Verification Change . . .",
    });
  } catch (error) {
    console.log("Can't find Data ::::", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}
