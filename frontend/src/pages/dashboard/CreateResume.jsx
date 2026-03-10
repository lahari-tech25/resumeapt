import { useState, useEffect, useRef } from "react";
import ClassicTemplate from "../../components/templates/ClassicTemplate";
import TwoColumnTemplate from "../../components/templates/TwoColumnTemplate";
import ModernTemplate from "../../components/templates/ModernTemplate";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import A4Page from "../../components/A4Page";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function CreateResume() {

  const resumeRef = useRef();
  const isFirstLoad = useRef(true);

  const { id } = useParams();
  const navigate = useNavigate();

  const [template, setTemplate] = useState("classic");
  const [isSaving, setIsSaving] = useState(false);

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

  /* ---------------- FETCH RESUME ---------------- */

  useEffect(() => {
    if (id) {
      fetchResume(id);
    }
  }, [id]);

  const fetchResume = async (resumeId) => {
    try {
      const res = await axios.get(
        `${API}/api/builder-resume/${resumeId}`,
        { withCredentials: true }
      );

      if (res.data?.resumeData) {
        setFormData(res.data.resumeData);
      }

      isFirstLoad.current = false;

    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- AUTO SAVE ---------------- */

  useEffect(() => {

    if (!id) return;

    if (isFirstLoad.current) return;

    const timeout = setTimeout(async () => {

      try {

        setIsSaving(true);

        await axios.post(
          `${API}/api/builder-resume/save`,
          {
            resumeId: id,
            resumeData: formData,
          },
          { withCredentials: true }
        );

        setIsSaving(false);

      } catch (err) {

        console.error("Autosave failed", err);

      }

    }, 2000);

    return () => clearTimeout(timeout);

  }, [formData, id]);

  /* ---------------- FORM HANDLERS ---------------- */

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const addItem = (section, structure) => {

    setFormData({
      ...formData,
      [section]: [...formData[section], structure]
    });

  };

  const handleItemChange = (section, index, field, value) => {

    const updated = [...formData[section]];

    updated[index][field] = value;

    setFormData({
      ...formData,
      [section]: updated
    });

  };

  /* ---------------- MANUAL SAVE ---------------- */

  const handleSave = async () => {

    try {

      const response = await axios.post(
        `${API}/api/builder-resume/save`,
        {
          resumeId: id,
          resumeData: formData,
        },
        { withCredentials: true }
      );

      const resumeId = response.data.resumeId;

      alert(" Resume saved successfully!");

      navigate(`/dashboard/create/${resumeId}`);

    } catch (err) {

      console.error(err);

    }

  };

  /* ---------------- DOWNLOAD ---------------- */

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

  /* ---------------- FORM UI ---------------- */

  const renderForm = () => (

    <div className="space-y-6">

      {/* PERSONAL INFO */}

      <div>

        <h2 className="text-xl font-semibold mb-3">Personal Info</h2>

        <input
          name="name"
          value={formData.name}
          placeholder="Full Name"
          onChange={handleChange}
          className="input"
        />

        <input
          name="phone"
          value={formData.phone}
          placeholder="Phone"
          onChange={handleChange}
          className="input"
        />

        <input
          name="email"
          value={formData.email}
          placeholder="Email"
          onChange={handleChange}
          className="input"
        />

        <input
          name="linkedin"
          value={formData.linkedin}
          placeholder="LinkedIn URL"
          onChange={handleChange}
          className="input"
        />

        <input
          name="github"
          value={formData.github}
          placeholder="GitHub URL"
          onChange={handleChange}
          className="input"
        />

      </div>

      {/* SUMMARY */}

      <div>

        <h2 className="text-xl font-semibold mb-2">Summary</h2>

        <textarea
          name="summary"
          value={formData.summary}
          placeholder="Professional summary..."
          onChange={handleChange}
          className="input"
        />

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
            <input
              value={item.role}
              placeholder="Role"
              className="input"
              onChange={(e) =>
                handleItemChange("experience", i, "role", e.target.value)
              }
            />

            <input
              value={item.company}
              placeholder="Company"
              className="input"
              onChange={(e) =>
                handleItemChange("experience", i, "company", e.target.value)
              }
            />

            <input
              value={item.duration}
              placeholder="Duration"
              className="input"
              onChange={(e) =>
                handleItemChange("experience", i, "duration", e.target.value)
              }
            />

            <textarea
              value={item.description}
              placeholder="Description"
              className="input"
              onChange={(e) =>
                handleItemChange("experience", i, "description", e.target.value)
              }
            />

          </>

        )}
      />

      {/* EDUCATION */}

      <Section
        title="Education"
        data={formData.education}
        add={() =>
          addItem("education", { degree: "", institution: "", duration: "", percentage: "" })
        }
        render={(item, i) => (

          <>
            <input
              value={item.degree}
              placeholder="Degree"
              className="input"
              onChange={(e) =>
                handleItemChange("education", i, "degree", e.target.value)
              }
            />

            <input
              value={item.institution}
              placeholder="Institution"
              className="input"
              onChange={(e) =>
                handleItemChange("education", i, "institution", e.target.value)
              }
            />

            <input
              value={item.percentage}
              placeholder="Percentage / CGPA"
              className="input"
              onChange={(e) =>
                handleItemChange("education", i, "percentage", e.target.value)
              }
            />

            <input
              value={item.duration}
              placeholder="Duration"
              className="input"
              onChange={(e) =>
                handleItemChange("education", i, "duration", e.target.value)
              }
            />

          </>

        )}
      />

      {/* PROJECTS */}

      <Section
        title="Projects"
        data={formData.projects}
        add={() => addItem("projects", { title: "", description: "" })}
        render={(item, i) => (

          <>
            <input
              value={item.title}
              placeholder="Project Title"
              className="input"
              onChange={(e) =>
                handleItemChange("projects", i, "title", e.target.value)
              }
            />

            <textarea
              value={item.description}
              placeholder="Description"
              className="input"
              onChange={(e) =>
                handleItemChange("projects", i, "description", e.target.value)
              }
            />

          </>

        )}
      />

      {/* SKILLS */}

      <Section
        title="Skills"
        data={formData.skills}
        add={() => addItem("skills", { category: "", items: "" })}
        render={(item, i) => (

          <>
            <input
              value={item.category}
              placeholder="Category"
              className="input"
              onChange={(e) =>
                handleItemChange("skills", i, "category", e.target.value)
              }
            />

            <input
              value={item.items}
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
          value={formData.achievements}
          onChange={handleChange}
          className="input"
        />

      </div>

      {/* HOBBIES */}

      <div>

        <h2 className="text-xl font-semibold mb-2">Hobbies</h2>

        <textarea
          name="hobbies"
          value={formData.hobbies}
          onChange={handleChange}
          className="input"
        />

      </div>

    </div>

  );

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

          {/* FORM */}

          <div className="flex-1 bg-white p-6 rounded-xl shadow overflow-y-auto max-h-[90vh]">
            {renderForm()}
          </div>

          {/* PREVIEW */}

          <div className="w-[794px] flex flex-col items-center gap-6 sticky top-6">

            <div id="resume-preview" ref={resumeRef}>

              <A4Page>

                {template === "classic" && <ClassicTemplate data={formData} />}

                {template === "twoColumn" && <TwoColumnTemplate data={formData} />}

                {template === "modern" && <ModernTemplate data={formData} />}

              </A4Page>

            </div>

            {/* BUTTONS */}

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

            {isSaving && (
              <p className="text-sm text-gray-500">
                Auto saving...
              </p>
            )}

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

      <button onClick={add} className="btn">
        + Add {title}
      </button>

    </div>

  );

}