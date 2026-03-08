import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  originalResume: {
    type: String,
    required: true // path to uploaded file
  },
  parsedText: {
    type: String,
    maxlength: 50000
  },
  jobDescription: {
    type: String
  },
  aiRewrittenResume: {
    type: mongoose.Schema.Types.Mixed, // stores AI-optimized JSON
  },
  status: {
    type: String,
    enum: ["uploaded", "parsed", "rewritten"],
    default: "uploaded"
  }
}, { timestamps: true });

export default mongoose.model("Resume", resumeSchema);