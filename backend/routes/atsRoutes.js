import express from "express";
import multer from "multer";
import fs from "fs";
import { createRequire } from "module";
import mammoth from "mammoth";

import ATSScan from "../models/ATSScan.js";
import verifyToken from "../middleware/authMiddleware.js";
import { runATS } from "../utils/atsEngine.js";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/scan", verifyToken, upload.single("resume"), async (req, res) => {
  try {
    const file = req.file;
    const { jobDescription } = req.body;

    if (!file || !jobDescription) {
      return res.status(400).json({ message: "Missing resume or job description" });
    }

    let extractedText = "";

    if (file.mimetype === "application/pdf") {
      const buffer = fs.readFileSync(file.path);
      const data = await pdfParse(buffer);
      extractedText = data.text;
    } else {
      const result = await mammoth.extractRawText({ path: file.path });
      extractedText = result.value;
    }

    fs.unlinkSync(file.path);

    const result = runATS(extractedText, jobDescription);

    const scan = await ATSScan.create({
      userId: req.user.id,
      jobDescription,
      resumeText: extractedText,
      atsScore: result.totalScore,
      sectionBreakdown: result.sectionBreakdown,
      matchedKeywords: result.matchedKeywords,
      missingKeywords: result.missingKeywords,
    });

    res.json(scan);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "ATS scan failed" });
  }
});

router.get("/history", verifyToken, async (req, res) => {
  try {
    const history = await ATSScan.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(history);

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch ATS history" });
  }
});

export default router;