import { User } from "../models/user.models.js";
import Decrypt from "../utils/Decrypt.js";
import Encrypt from "../utils/Encrypt.js";
import FileUploader from "../utils/FileUploader.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import UnlinkFile from "../utils/UnlinkFile.js";

export async function getuser(req, res) {
  try {
    const { id } = req.param;
    const user = await User.findById(id, "-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log("Error fetching user");
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function registeruser(req, res) {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await Encrypt(password);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res
      .status(201)
      .json({ success: true, message: "User successfully registered" });
  } catch (error) {
    console.log("ERROR CREATING USER :::", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function loginuser(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User dosen't exists" });
    }

    await Decrypt(password, user.password)
      .then((isMatch) => {
        if (isMatch) {
          const token = jwt.sign(
            { id: user._id },
            process.env.USER_JWT_SECRET,
            {
              expiresIn: process.env.USER_JWT_EXPIRE,
            }
          );

          res.status(200).json({
            success: true,
            message: "Login Successfully",
            token,
            user: { id: user._id, username: user.username, email: user.email },
          });
        } else {
          res.status(400).json({
            success: false,
            message: "Login Failed, Password Incorrect",
          });
        }
      })
      .catch((error) => {
        console.log("Error during password decryption ::::", error);
        res.status(500).json({ success: false, message: "Server Error" });
      });
  } catch (error) {
    console.log("ERROR CREATING USER :::", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function userLogout(req, res) {
  res.status(200).json({ success: true, message: "Logged out successfully" });
}

export async function updateuser(req, res) {
  try {
    const {
      username,
      email,
      phoneNumber,
      country,
      address,
      city,
      state,
      pincode,
    } = req.body;
    const avatar = req.files?.avatar;

    const updateUser = {
      username,
      email,
      phoneNumber,
      avatar,
      country,
      address,
      city,
      state,
      pincode,
    };

    const user = await User.findById(req.user.id);

    if (avatar) {
      UnlinkFile(user.avatar);
      const avatarPath = await FileUploader(avatar);
      updateUser.avatar = avatarPath;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateUser, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      message: "User successfully updated",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}
