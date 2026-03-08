import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true,index: true },
  password: { type: String, required: true },
  plan: {
    type: String,
    enum: ["free", "pro"],
    default: "free"
  },
}, { timestamps: true });

export default mongoose.model("User", userSchema);