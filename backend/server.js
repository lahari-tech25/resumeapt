import "./config/env.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import errorHandler from "./middleware/errormiddleware.js";
import cookieParser from "cookie-parser";
import resumeRoutes from "./routes/resumeRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import resumeBuilderRoutes from "./routes/resumebuilder.js";
import rateLimit from "express-rate-limit";
import atsRoutes from "./routes/atsRoutes.js";
import dashboardRoutes from "./routes/dashboard.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



connectDB();

const app = express();

// 1️ Security middleware FIRST
import helmet from "helmet";

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: [
          "'self'",
          "data:",
          "https:",
          "blob:"
        ],
        scriptSrc: ["'self'", "'unsafe-inline'", "https:"],
        styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      },
    },
  })
);

//  CRITICAL: Apply middleware in correct order
// 1. CORS first
app.use(cors({
  origin: process.env.NODE_ENV === "production" ? true : process.env.CLIENT_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// 2. Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Cookie parser
app.use(cookieParser());

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
});

// 4. Routes
app.use("/api/auth", authRoutes);
app.use("/api/builder-resume", resumeBuilderRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ai", aiLimiter);
app.use("/api/ai", aiRoutes);
app.use("/api/ats", atsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/subscription", subscriptionRoutes);


// Serve frontend AFTER API routes
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("/", (req, res) => {
  res.send("ResumeApt Backend Running!");
});

app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ message: "API route not found" });
  }

  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// 5. Error handler last
app.use(errorHandler);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));

