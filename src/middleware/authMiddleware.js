import jwt from "jsonwebtoken";

export function isAuthenticated(secretKey) {
  return async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    try {
      const decoded = jwt.verify(token, secretKey);
      req.user = decoded; // Attach decoded user info to req
      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  };
}