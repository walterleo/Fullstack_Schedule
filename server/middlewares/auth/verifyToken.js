import jwt from "jsonwebtoken";

function authMiddleware(req, res, next) {
  try {
    const token = req.headers["x-auth-token"];

    let decoded = jwt.verify(token, "hackingwalter");
    req.payload = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorised. Please Login" });
  }
}

export default authMiddleware;
