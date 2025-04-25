import { User } from "../models/user.models.js";

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
};
