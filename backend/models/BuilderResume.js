import mongoose from "mongoose";

const builderResumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    resumeData: {
      type: mongoose.Schema.Types.Mixed, // stores full JSON from frontend
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("BuilderResume", builderResumeSchema);