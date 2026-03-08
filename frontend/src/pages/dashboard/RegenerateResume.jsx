import React, { useState } from "react";
import ResumeUpload from "../../components/ResumeUpload";
import { useNavigate } from "react-router-dom";

export default function RegenerateResume() {
  const [parsedResume, setParsedResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resumeId, setResumeId] = useState(null);
  const [originalResume, setOriginalResume] = useState(""); // store uploaded resume name
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!parsedResume || !jobDescription) {
      return alert("Please upload resume and paste job description.");
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: parsedResume, jobDescription }),
      });

      if (!res.ok) throw new Error("AI generation failed");

      const data = await res.json();
      const optimizedResume = data.data || data;

      if (!optimizedResume || typeof optimizedResume !== "object") {
        throw new Error("Invalid resume structure received");
      }

      // ✅ Pass resumeId & originalResume to ResumeView
      navigate("/dashboard/resume-view", {
        state: { optimizedResume, originalResume, resumeId },
      });
    } catch (error) {
      console.error("Error generating resume:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Regenerate Resume</h2>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Upload Your Resume</h3>
        <ResumeUpload
          setParsedResume={setParsedResume}
          setResumeId={setResumeId}
          setOriginalResume={setOriginalResume}
        />
      </div>

      {parsedResume && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Extracted Resume Content</h3>
          <div className="bg-gray-100 p-4 rounded-lg max-h-60 overflow-y-auto text-sm whitespace-pre-wrap border">
            {parsedResume}
          </div>
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Job Description</h3>
        <textarea
          placeholder="Paste Job Description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={10}
          className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Resume"}
      </button>
    </div>
  );
}