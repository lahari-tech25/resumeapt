// routes/resumebuilder.js
import express from "express";
import BuilderResume from "../models/BuilderResume.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();


// GET SINGLE RESUME
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const resume = await BuilderResume.findOne({
      _id: req.params.id,
      userId: req.user.id, // protect other users' resumes
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.json(resume);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// SAVE RESUME (Builder)
router.post("/save", verifyToken, async (req, res) => {
  try {
    const { resumeId, resumeData } = req.body;

    let resume;

    if (resumeId) {
      // UPDATE existing
      resume = await BuilderResume.findOneAndUpdate(
        { _id: resumeId, userId: req.user.id },
        { resumeData },
        { new: true }
      );
    } else {
      // CREATE new
      resume = await BuilderResume.create({
        userId: req.user.id,
        resumeData,
      });
    }

    res.json({
      message: "Resume saved successfully",
      resumeId: resume._id,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET ALL BUILDER RESUMES (History)
router.get("/", verifyToken, async (req, res) => {
  try {
    const resumes = await BuilderResume.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(resumes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;