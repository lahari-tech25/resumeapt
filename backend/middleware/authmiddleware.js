import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET;



if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}
const TOKEN_NAME = "resumeapt_token";

const verifyToken = (req, res, next) => {
  try {

    const token =
      req.cookies[TOKEN_NAME] ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();

  } catch (err) {

    console.error("Token verification failed:", err.message);

    res.status(401).json({ message: "Invalid Token" });

  }
};

export default verifyToken;