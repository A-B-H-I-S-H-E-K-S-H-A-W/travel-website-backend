import { User } from "../models/user.models.js";
import hashPassword from "../utils/hashPassword.js";

export const userAPI = {
  async getuser(req, res) {
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
  },

  async registeruser(req, res) {
    try {
      const { username, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = hashPassword(password);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });

      await User.save(newUser);

      res.status(201).json("User successfully registered");
    } catch (error) {
      console.log("ERROR CREATING USER :::", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async loginuser(req, res) {
    try {
      const { email, password } = req.body;
    } catch (error) {}
  },
};
