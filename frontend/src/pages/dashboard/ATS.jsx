import React, { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import ScoreCircle from "../../components/ScoreCircle";
import ProgressBar from "../../components/ProgressBar";

const API = import.meta.env.VITE_API_URL;

const ATS = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (e) => {
    e.preventDefault();

    if (!resumeFile || !jobDescription.trim()) {
      alert("Please upload a resume and paste a job description.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobDescription", jobDescription);

    try {
      const res = await axios.post(
        `${API}/api/ats/scan`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("ATS Analysis Failed");
    }

    setLoading(false);
  };

  const generateSuggestions = () => {
    if (!result?.missingKeywords) return [];

    return result.missingKeywords.slice(0, 5).map(
      (word) => `Try adding "${word}" in your resume if applicable.`
    );
  };

  const downloadPDF = () => {
    if (!result) return;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("ATS Report", 20, 20);

    doc.setFontSize(12);
    doc.text(`Overall Score: ${result.atsScore}%`, 20, 35);

    doc.text("Matched Keywords:", 20, 50);
    doc.text(
      result.matchedKeywords?.length
        ? result.matchedKeywords.join(", ")
        : "None",
      20,
      60,
      { maxWidth: 170 }
    );

    doc.text("Missing Keywords:", 20, 80);
    doc.text(
      result.missingKeywords?.length
        ? result.missingKeywords.join(", ")
        : "None",
      20,
      90,
      { maxWidth: 170 }
    );

    doc.save("ATS_Report.pdf");
  };

  const highlightJD = () => {
    if (!result?.missingKeywords) return jobDescription;

    let highlighted = jobDescription;

    result.missingKeywords.forEach((word) => {
      const regex = new RegExp(`(${word})`, "gi");
      highlighted = highlighted.replace(
        regex,
        `<span style="background-color:#fee2e2; padding:2px;">$1</span>`
      );
    });

    return highlighted;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">
          Smart ATS Analyzer
        </h1>

        {/* Form */}
        <form onSubmit={handleAnalyze} className="space-y-4">
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={(e) => setResumeFile(e.target.files[0])}
            className="w-full border p-2 rounded"
          />

          <textarea
            rows="6"
            placeholder="Paste Job Description..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full border p-3 rounded"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>
        </form>

        {/* Results */}
        {result && (
          <div className="mt-10 space-y-8">

            {/* Score Circle */}
            <div className="flex justify-center">
              <ScoreCircle score={result.atsScore || 0} />
            </div>

            {/* Section Breakdown */}
            <div className="space-y-4">
              <ProgressBar
                label="Skills"
                value={result.sectionBreakdown?.skills || 0}
              />
              <ProgressBar
                label="Experience"
                value={result.sectionBreakdown?.experience || 0}
              />
              <ProgressBar
                label="Education"
                value={result.sectionBreakdown?.education || 0}
              />
            </div>

            {/* Suggestions */}
            {generateSuggestions().length > 0 && (
              <div>
                <h2 className="font-semibold mb-2">
                  Improvement Suggestions
                </h2>
                <ul className="list-disc pl-5 space-y-1">
                  {generateSuggestions().map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Job Description Highlight */}
            <div>
              <h2 className="font-semibold mb-2">
                Job Description Highlight
              </h2>
              <div
                className="p-4 bg-gray-100 rounded"
                dangerouslySetInnerHTML={{ __html: highlightJD() }}
              />
            </div>

            {/* Keywords */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-green-600 font-semibold mb-2">
                  Matched Keywords
                </h3>
                <p>
                  {result.matchedKeywords?.length
                    ? result.matchedKeywords.join(", ")
                    : "None"}
                </p>
              </div>

              <div>
                <h3 className="text-red-600 font-semibold mb-2">
                  Missing Keywords
                </h3>
                <p>
                  {result.missingKeywords?.length
                    ? result.missingKeywords.join(", ")
                    : "None"}
                </p>
              </div>
            </div>

            {/* Download */}
            <div className="text-center">
              <button
                onClick={downloadPDF}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
              >
                Download PDF Report
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default ATS;