import { useState } from "react";
import ClassicTemplate from "../../components/templates/ClassicTemplate";
import TwoColumnTemplate from "../../components/templates/TwoColumnTemplate";
import ModernTemplate from "../../components/templates/ModernTemplate";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";
import axios from "axios";

export default function CreateResume() {

  const resumeRef = useRef();

  const [template, setTemplate] = useState("classic");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    linkedin: "",
    github: "",
    summary: "",
    experience: [],
    education: [],
    projects: [],
    skills: [],
    hobbies: "",
  achievements: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // GENERIC ADD
  const addItem = (section, structure) => {
    setFormData({
      ...formData,
      [section]: [...formData[section], structure],
    });
  };

  // GENERIC UPDATE
  const handleItemChange = (section, index, field, value) => {
    const updated = [...formData[section]];
    updated[index][field] = value;
    setFormData({ ...formData, [section]: updated });
  };

  const renderForm = () => (
    <div className="space-y-6">

      {/* PERSONAL INFO */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Personal Info</h2>
        <input name="name" placeholder="Full Name" onChange={handleChange} className="input" />
        <input name="phone" placeholder="Phone" onChange={handleChange} className="input" />
        <input name="email" placeholder="Email" onChange={handleChange} className="input" />
        <input name="linkedin" placeholder="LinkedIn URL" onChange={handleChange} className="input" />
        <input name="github" placeholder="GitHub URL" onChange={handleChange} className="input" />
      </div>

      {/* SUMMARY */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Summary</h2>
        <textarea name="summary" placeholder="Professional summary..." onChange={handleChange} className="input" />
      </div>

      {/* EXPERIENCE */}
      <Section
        title="Experience"
        data={formData.experience}
        add={() =>
          addItem("experience", { role: "", company: "", duration: "", description: "" })
        }
        render={(item, i) => (
          <>
            <input placeholder="Role" className="input"
              onChange={(e) => handleItemChange("experience", i, "role", e.target.value)} />
            <input placeholder="Company" className="input"
              onChange={(e) => handleItemChange("experience", i, "company", e.target.value)} />
            <input placeholder="Duration" className="input"
              onChange={(e) => handleItemChange("experience", i, "duration", e.target.value)} />
            <textarea placeholder="Description" className="input"
              onChange={(e) => handleItemChange("experience", i, "description", e.target.value)} />
          </>
        )}
      />

      {/* EDUCATION */}
      <Section
        title="Education"
        data={formData.education}
        add={() =>
          addItem("education", { degree: "", institution: "", duration: "",percentage: "" })
        }
        render={(item, i) => (
          <>
            <input placeholder="Degree" className="input"
              onChange={(e) => handleItemChange("education", i, "degree", e.target.value)} />
            <input placeholder="Institution" className="input"
              onChange={(e) => handleItemChange("education", i, "institution", e.target.value)} />
              <input
  placeholder="Percentage / CGPA"
  className="input"
  onChange={(e) =>
    handleItemChange("education", i, "percentage", e.target.value)
  }
/>
            <input placeholder="Duration" className="input"
              onChange={(e) => handleItemChange("education", i, "duration", e.target.value)} />
          </>
        )}
      />

      {/* PROJECTS */}
      <Section
        title="Projects"
        data={formData.projects}
        add={() =>
          addItem("projects", { title: "", description: "" })
        }
        render={(item, i) => (
          <>
            <input placeholder="Project Title" className="input"
              onChange={(e) => handleItemChange("projects", i, "title", e.target.value)} />
            <textarea placeholder="Description" className="input"
              onChange={(e) => handleItemChange("projects", i, "description", e.target.value)} />
          </>
        )}
      />

      {/* SKILLS */}
      <Section
  title="Skills"
  data={formData.skills}
  add={() =>
    addItem("skills", { category: "", items: "" })
  }
  render={(item, i) => (
    <>
      <input
        placeholder="Category (e.g. Technical Skills)"
        className="input"
        onChange={(e) =>
          handleItemChange("skills", i, "category", e.target.value)
        }
      />
      <input
        placeholder="Skills (comma separated)"
        className="input"
        onChange={(e) =>
          handleItemChange("skills", i, "items", e.target.value)
        }
      />
    </>
  )}
/>
{/* ACHIEVEMENTS */}
<div>
  <h2 className="text-xl font-semibold mb-2">Achievements</h2>
  <textarea
    name="achievements"
    placeholder="Comma separated achievements"
    onChange={handleChange}
    className="input"
  />
</div>

{/* HOBBIES */}
<div>
  <h2 className="text-xl font-semibold mb-2">Hobbies</h2>
  <textarea
    name="hobbies"
    placeholder="Comma separated hobbies"
    onChange={handleChange}
    className="input"
  />
</div>
    </div>
  );


  const saveResume = async () => {
  const res = await fetch("http://localhost:5000/save-builder-resume", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: "YOUR_LOGGED_IN_USER_ID",
      resumeData: formData,
    }),
  });

  const data = await res.json();
  alert("Saved! Resume ID: " + data.resumeId);
};

  const downloadPDF = async () => {
  const element = resumeRef.current;

  const canvas = await html2canvas(element, {
    scale: 2,
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: [794, 1123],
  });

  pdf.addImage(imgData, "PNG", 0, 0, 794, 1123);
  pdf.save("ResumeApt_Resume.pdf");
};

const handleSave = async () => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/builder-resume/save",
      formData,
      { withCredentials: true }   //  VERY IMPORTANT
    );

    alert("Resume Saved ");
    console.log("Resume ID:", response.data.resumeId);
  } catch (err) {
    console.error(err);
    alert("Error Saving Resume ");
  }
};

const fetchResume = async (id) => {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/builder-resume/${id}`,
      { withCredentials: true }
    );

    setFormData(res.data.resumeData);
  } catch (err) {
    console.error(err);
  }
};

const handleDownload = async () => {
  const input = document.getElementById("resume-preview");

  const canvas = await html2canvas(input, { scale: 2 });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const imgWidth = 210;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  pdf.save("resume.pdf");
};



 return (
  <div className="min-h-screen bg-neutral-100 p-6">
    <div className="max-w-7xl mx-auto space-y-6">

      {/* TEMPLATE SELECTOR */}
      <div className="flex gap-4">
        <button onClick={() => setTemplate("classic")} className="btn">
          Classic
        </button>
        <button onClick={() => setTemplate("twoColumn")} className="btn">
          Two Column
        </button>
        <button onClick={() => setTemplate("modern")} className="btn">
          Modern
        </button>
      </div>

      <div className="flex gap-8 items-start">

        {/* LEFT FORM */}
        <div className="flex-1 bg-white p-6 rounded-xl shadow overflow-y-auto max-h-[90vh]">
  {renderForm()}
</div>

        {/* RIGHT PREVIEW */}
        <div className="w-[794px] flex flex-col items-center gap-6 sticky top-6">

          <div id="resume-preview" ref={resumeRef}>
            {template === "classic" && <ClassicTemplate data={formData} />}
            {template === "twoColumn" && <TwoColumnTemplate data={formData} />}
            {template === "modern" && <ModernTemplate data={formData} />}
          </div>

          {/* ✅ BUTTONS INSIDE COMPONENT */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
            >
              Save Resume
            </button>

            <button
              onClick={handleDownload}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
            >
              Download PDF
            </button>
          </div>

        </div>

      </div>
    </div>
  </div>
);
}

function Section({ title, data, add, render }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      {data.map((item, i) => (
        <div key={i} className="border p-4 rounded mb-3 space-y-2">
          {render(item, i)}
        </div>
      ))}
      <button onClick={add} className="btn">+ Add {title}</button>
    </div>
  );
}

