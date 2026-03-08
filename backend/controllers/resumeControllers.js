import fs from "fs";
import { createRequire } from "module";
import mammoth from "mammoth";
import { generateAIResume } from "../services/aiService.js";
import Resume from "../models/Resume.js";
import BuilderResume from "../models/BuilderResume.js";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse"); //  works with pdf-parse v1

export const extractResume = async (req, res) => {
  // console.log("REQ.USER:", req.user);   // should show user ID
  // console.log("REQ.FILE:", req.file);
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let extractedText = "";

    if (file.mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(file.path);
      const data = await pdfParse(dataBuffer);
      extractedText = data.text;
    } else if (file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const result = await mammoth.extractRawText({ path: file.path });
      extractedText = result.value;
    } else {
      return res.status(400).json({ message: "Unsupported file type" });
    }

    // Remove temp file
    if (fs.existsSync(file.path)) {
  fs.unlinkSync(file.path);
}

    // Save to DB
    const newResume = await Resume.create({
      userId: req.user.id,
      originalResume: file.originalname, // or file.path if you store the file
      parsedText: extractedText,
      status: "parsed"
    });

    res.json({ extractedText, resumeId: newResume._id });
  } catch (error) {
    console.error("Resume extraction error:", error);
    res.status(500).json({ message: "Error extracting resume" });
  }
};


export const generateResume = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ message: "Missing input" });
    }

    const optimizedResume = await generateAIResume(
      resumeText,
      jobDescription
    );

    res.json({ data: optimizedResume });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "AI generation failed" });
  }
};

/* Get all resumes for logged user */
export const getUserResumes = async (req, res) => {
  try {
    const resumes = await BuilderResume.find({
      userId: req.user.id
    }).sort({ createdAt: -1 });

    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch resumes" });
  }
};

/* Get single resume */
export const getResumeById = async (req, res) => {
  try {
    const resume = await BuilderResume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: "Error loading resume" });
  }
};

/* Update resume */
export const updateResume = async (req, res) => {
  try {
    const resume = await BuilderResume.findByIdAndUpdate(
      req.params.id,
      {
        resumeData: req.body
      },
      { new: true }
    );

    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: "Failed to update resume" });
  }
};

//delete resume 
export const deleteResume = async (req, res) => {
  try {

    const resume = await BuilderResume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Ensure user owns the resume
    if (resume.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await BuilderResume.findByIdAndDelete(req.params.id);

    res.json({ message: "Resume deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Failed to delete resume" });
  }
};