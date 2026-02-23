const mongoose = require("mongoose");

const builderResumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resumeData: {
      type: Object, // stores full JSON from frontend
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BuilderResume", builderResumeSchema);