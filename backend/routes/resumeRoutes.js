import express from "express";
import multer from "multer";
import Resume from "../models/Resume.js";
import verifyToken from "../middleware/authMiddleware.js";

import {
  extractResume,
  generateResume,
  getUserResumes,
  getResumeById,
  updateResume,
  deleteResume
} from "../controllers/resumeControllers.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });


// Upload original resume
router.post("/upload", verifyToken, upload.single("resume"), extractResume);


// Generate AI optimized resume
router.post("/generate", verifyToken, generateResume);


// Save / Update optimized resume
router.post("/save", verifyToken, async (req, res) => {

  try {

    const { resumeId, optimizedResume, jobDescription, originalResume } = req.body;

    if (!optimizedResume || !originalResume) {
      return res.status(400).json({
        message: "optimizedResume and originalResume are required",
      });
    }

    let savedResume;

    if (resumeId) {

      savedResume = await Resume.findOneAndUpdate(
        { _id: resumeId, userId: req.user.id },
        {
          aiRewrittenResume: optimizedResume,
          jobDescription,
          originalResume,
          status: "rewritten",
        },
        { new: true }
      );

    } else {

      savedResume = await Resume.create({
        userId: req.user.id,
        aiRewrittenResume: optimizedResume,
        jobDescription,
        originalResume,
        status: "rewritten",
      });

    }

    res.json({
      message: "Resume saved successfully",
      resumeId: savedResume._id,
      optimizedResume: savedResume.aiRewrittenResume,
    });

  } catch (error) {

    console.error("SAVE RESUME ERROR:", error);

    res.status(500).json({ message: "Failed to save AI resume" });

  }

});


// ==============================
// RESUME HISTORY
// ==============================

router.get("/my-resumes", verifyToken, getUserResumes);


// Get resume by id
router.get("/:id", verifyToken, getResumeById);


// Update resume
router.put("/:id", verifyToken, updateResume);


// Delete resume
router.delete("/:id", verifyToken, deleteResume);


export default router;