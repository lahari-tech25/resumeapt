import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import ClassicTemplate from "../../components/templates/ClassicTemplate";
import ModernTemplate from "../../components/templates/ModernTemplate";
import TwoColumnTemplate from "../../components/templates/TwoColumnTemplate";
import A4Page from "../../components/A4Page";

const API = import.meta.env.VITE_API_URL; // http://localhost:5000

const ResumeView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [resumeData, setResumeData] = useState(null);
  const [originalResume, setOriginalResume] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("classic");

  // Fetch resume if ID exists OR use location.state
  useEffect(() => {
    const fetchResume = async () => {
      try {
        if (id) {
          try {
            // Try Builder Resume first
            const res = await axios.get(`${API}/api/builder-resume/${id}`, {
              withCredentials: true,
            });
            if (res.data?.resumeData) {
              setResumeData(res.data.resumeData);
              return;
            }
          } catch (err) {
            console.log("Not a builder resume, trying AI resume...");
          }

          try {
            // Try AI Resume
            const res = await axios.get(`${API}/api/resume/${id}`, {
              withCredentials: true,
            });

            const data = {
              ...res.data.aiRewrittenResume,
              _id: res.data._id,
            };
            setResumeData(data);
            setOriginalResume(res.data.originalResume || "");
          } catch (err) {
            console.error("Failed to fetch resume:", err);
            toast.error("Failed to load resume");
          }
        } else if (location.state?.optimizedResume) {
          // Resume passed from AI regeneration
          setResumeData(location.state.optimizedResume);
          setOriginalResume(location.state.originalResume || "");
        }
      } catch (err) {
        console.error("Failed to fetch resume:", err);
        toast.error("Failed to load resume");
      }
    };

    fetchResume();
  }, [id, location.state]);

  if (!resumeData || typeof resumeData !== "object") {
    return (
      <div className="text-center mt-20">
        <p>No resume data found.</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 text-blue-600 underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  const handleSave = async () => {
    if (!resumeData) return;

    const resumeIdToUse = location.state?.resumeId || resumeData._id;
    const originalResumeToUse = location.state?.originalResume || originalResume;

    if (!originalResumeToUse) {
      console.error("Original resume is missing!");
      toast.error("Original resume is missing!");
      return;
    }

    try {
      await axios.post(
        `${API}/api/resume/save`,
        {
          resumeId: resumeIdToUse,
          optimizedResume: resumeData,
          originalResume: originalResumeToUse,
          jobDescription: resumeData.jobDescription || "",
        },
        { withCredentials: true }
      );

      toast.success("Resume saved successfully!");
    } catch (error) {
      console.error("Failed to save resume:", error);
      toast.error("Failed to save resume");
    }
  };

  const handleDownloadPDF = async () => {
  try {
    const input = document.getElementById("resume-sheet"); // container with resume

    if (!input) {
      console.error("Resume container not found!");
      return;
    }

    // Convert the resume to a canvas
    const canvas = await html2canvas(input, { scale: 2 });

    // Convert canvas to image
    const imgData = canvas.toDataURL("image/png");

    // Create PDF
    const pdf = new jsPDF("p", "mm", "a4"); // portrait, mm units, A4 size

    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

    pdf.save("resume.pdf"); // download
  } catch (error) {
    console.error("PDF download error:", error);
  }
};

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      {/* Toaster for all toast messages */}
      <Toaster position="top-right" />

      <h2 className="text-2xl font-bold text-center mb-6">Optimized Resume Preview</h2>

      {/* Template Selector */}
      <div className="flex gap-4 justify-center mb-10">
        {["classic", "modern", "two"].map((template) => (
          <button
            key={template}
            onClick={() => setSelectedTemplate(template)}
            className={`px-4 py-2 rounded border ${
              selectedTemplate === template
                ? "bg-blue-600 text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {template === "two"
              ? "Two Column"
              : template.charAt(0).toUpperCase() + template.slice(1)}
          </button>
        ))}
      </div>

      {/* Resume */}
      <div className="flex justify-center">
        <div id="resume-sheet">
          <A4Page>
            {selectedTemplate === "classic" && <ClassicTemplate data={resumeData} />}
            {selectedTemplate === "modern" && <ModernTemplate data={resumeData} />}
            {selectedTemplate === "two" && <TwoColumnTemplate data={resumeData} />}
          </A4Page>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-6 mt-10">
        <button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
        >
          Save Resume
        </button>

        <button
          onClick={handleDownloadPDF}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          Download as PDF
        </button>
      </div>
    </div>
  );
};

export default ResumeView;