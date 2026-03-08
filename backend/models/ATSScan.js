import mongoose from "mongoose";

const atsScanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    jobDescription: {
      type: String,
      required: true,
    },
    resumeText: {
      type: String,
      required: true,
    },
    atsScore: {
      type: Number,
      required: true,
    },
    sectionBreakdown: {
  skills: { type: Number, default: 0 },
  experience: { type: Number, default: 0 },
  education: { type: Number, default: 0 },
  projects: { type: Number, default: 0 },
  others: { type: Number, default: 0 }
},
    matchedKeywords: [String],
    missingKeywords: [String],
  },
  { timestamps: true }
);

export default mongoose.model("ATSScan", atsScanSchema);