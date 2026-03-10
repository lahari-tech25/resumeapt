import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import verifyToken  from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/stats", verifyToken, getDashboardStats);

export default router;