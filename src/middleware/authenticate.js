import jwt from "jsonwebtoken";

export function authenticate(role = "user") {
  return async function (req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    const secretMap = {
      user: process.env.USER_JWT_SECRET,
      admin: process.env.ADMIN_JWT_SECRET,
      superadmin: process.env.SUPERADMIN_JWT_SECRET,
    };

    try {
      const decoded = jwt.verify(token, secretMap[role]);

      req.user = decoded;
      next();
    } catch (error) {
      console.error("JWT verification error:", error.message);
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  };
}
