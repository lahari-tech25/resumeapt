import React, { useState } from "react";
import axios from "axios";

export default function ResumeUpload({ setParsedResume, setResumeId, setOriginalResume }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return console.error("Please select a resume file first");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/resumes/upload",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const extractedText = res.data.extractedText;
      const uploadedResumeId = res.data.resumeId;

      if (!extractedText) throw new Error("Failed to parse resume");

      setParsedResume(extractedText);

      if (setResumeId) setResumeId(uploadedResumeId);
      if (setOriginalResume) setOriginalResume(file.name); // ✅ always use file.name

      console.log("Resume uploaded and parsed successfully!");
    } catch (err) {
      console.error("Failed to upload resume:", err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <input type="file" accept=".pdf,.docx" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload & Parse"}
      </button>
    </div>
  );
}