import Resume from "../models/Resume.js";
import ATSScan from "../models/ATSScan.js";
import BuilderResume from "../models/BuilderResume.js";
import User from "../models/User.js";

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    // resumes created from builder
    const resumesCreated = await BuilderResume.countDocuments({
      userId: userId
    });

    // resumes regenerated with AI
    const tailoredResumes = await Resume.countDocuments({
      userId: userId
    });

    // ATS scans
    const atsChecks = await ATSScan.countDocuments({
      userId: userId
    });

    res.json({
  resumesCreated,
  tailoredResumes,
  atsChecks,
  plan: user.plan === "pro" ? "Pro" : "Free"
});

  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Failed to load stats" });
  }
};