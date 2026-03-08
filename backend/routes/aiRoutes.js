import express from "express";
import { generateResume } from "../controllers/resumeControllers.js";

const router = express.Router();

// POST /api/ai/generate
router.post("/generate", generateResume);

export default router;