import jwt from "jsonwebtoken";

// Ye middleware har protected route se pehle chalega.
// Kaam: request ke header mein token check karna, verify karna,
// aur agar valid hai to req.userId set karke aage badhna (next()).
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization; // format: "Bearer <token>"

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // isse baad ke routes mein pata chalega ye request kis user ki hai
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is invalid or expired" });
  }
};

export default authMiddleware;
