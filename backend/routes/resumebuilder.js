const express = require("express");
const router = express.Router();
const BuilderResume = require("../models/BuilderResume");
const verifyToken = require("../middleware/authMiddleware");


// SAVE RESUME
router.post("/save", verifyToken, async (req, res) => {
  try {
    const newResume = await BuilderResume.create({
      userId: req.user.id,   // ✅ get from token
      resumeData: req.body, // formData directly
    });

    res.json({
      message: "Resume saved successfully",
      resumeId: newResume._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save resume" });
  }
});


// GET RESUME BY ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const resume = await BuilderResume.findOne({
      _id: req.params.id,
      userId: req.user.id,  // ✅ ensure user owns it
    });

    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    res.json(resume);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;