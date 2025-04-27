import jwt from "jsonwebtoken";

export async function isAuthenticated(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.USER_JWT_SECRET);
    req.user = decoded; // Attach user info from token to request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
}
