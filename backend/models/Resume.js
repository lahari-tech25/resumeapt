const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  originalResume: {
    type: String,
    required: true // path to uploaded file
  },
  parsedText: {
    type: String
  },
  jobDescription: {
    type: String
  },
  aiRewrittenResume: {
    type: String
  },
  status: {
    type: String,
    enum: ["uploaded", "parsed", "rewritten"],
    default: "uploaded"
  }
}, { timestamps: true });

module.exports = mongoose.model("Resume", resumeSchema);
