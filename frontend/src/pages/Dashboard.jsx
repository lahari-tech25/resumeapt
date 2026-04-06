import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function Dashboard() {

  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    resumesCreated: 0,
    tailoredResumes: 0,
    atsChecks: 0,
    plan: "Free",
  });

  const [history, setHistory] = useState([]);

  useEffect(() => {

    const fetchData = async () => {

  try {

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const userRes = await axios.get(`${API}/auth/me`, { headers });

    const statsRes = await axios.get(`${API}/dashboard/stats`, {
      headers,
    });

    const historyRes = await axios.get(
      `${API}/resumes/my-resumes`,
      { headers }
    );

    setUser(userRes.data);
    setStats(statsRes.data);
    setHistory(historyRes.data);

  } catch (error) {

    console.error(error);
    localStorage.removeItem("token");
    navigate("/login");

  } finally {
    setLoading(false);
  }

};

    fetchData();

  }, [navigate]);



  const handleLogout = () => {

    localStorage.removeItem("token");
    navigate("/login");

  };



  const handleDeleteResume = async (resumeId) => {

    const confirmDelete = window.confirm("Delete this resume?");
    if (!confirmDelete) return;

    try {

      const token = localStorage.getItem("token");

      await axios.delete(`${API}/resumes/${resumeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // remove resume from UI instantly
      setHistory((prevHistory) =>
        prevHistory.filter((resume) => resume._id !== resumeId)
      );

      // update stats instantly
      setStats((prevStats) => ({
        ...prevStats,
        resumesCreated: Math.max(prevStats.resumesCreated - 1, 0),
      }));

    } catch (error) {

      console.error("Delete error:", error);

    }

  };



  if (loading || !user) {
  return (
    <div className="flex justify-center items-center min-h-screen">
      Loading...
    </div>
  );
}



  return (

    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-8 py-10">

        {/* HEADER */}

        <div className="flex items-center justify-between mb-14">

          <h1 className="text-2xl font-bold text-blue-700">
            ResumeApt
          </h1>

          <div className="relative">

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-11 h-11 rounded-full bg-blue-600 text-white font-semibold flex items-center justify-center"
            >
              {user?.name?.charAt(0).toUpperCase()}
            </button>

            {menuOpen && (

              <div className="absolute right-0 mt-3 w-56 bg-white border shadow-lg rounded-lg">

                <div className="px-4 py-3 border-b">

                  <p className="text-sm font-medium">
                    {user.name}
                  </p>

                  <p className="text-xs text-gray-500">
                    {user.email}
                  </p>

                </div>

                <Link
                  to="/subscription"
                  className="block px-4 py-3 text-sm hover:bg-gray-100"
                >
                  Subscription / Upgrade
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>

              </div>

            )}

          </div>

        </div>



        {/* WELCOME */}

        <div className="mb-12">

          <h2 className="text-3xl font-semibold">
            Welcome back, {user?.name}
          </h2>

          <p className="text-gray-600 mt-2">
            Manage and optimize your resumes efficiently.
          </p>

        </div>



        {/* ACTION CARDS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">

          <Link
            to="/create-resume"
            className="bg-white border p-8 hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold text-blue-700 mb-3">
              Create Resume
            </h3>

            <p className="text-sm text-gray-600">
              Build a resume from scratch using AI.
            </p>

          </Link>



          <Link
            to="/dashboard/regenerate"
            className="bg-white border p-8 hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold text-blue-700 mb-3">
              Regenerate Resume
            </h3>

            <p className="text-sm text-gray-600">
              Tailor your resume to a job description.
            </p>

          </Link>



          <Link
            to="/dashboard/ats"
            className="bg-white border p-8 hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold text-blue-700 mb-3">
              ATS Score Check
            </h3>

            <p className="text-sm text-gray-600">
              Analyze resume compatibility with ATS.
            </p>

          </Link>

        </div>



        {/* STATS */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">

          <div className="bg-white border p-6">

            <p className="text-sm text-gray-600">
              Resumes Created
            </p>

            <h3 className="text-2xl font-semibold mt-2">
              {stats.resumesCreated}
            </h3>

          </div>



          <div className="bg-white border p-6">

            <p className="text-sm text-gray-600">
              Tailored Resumes
            </p>

            <h3 className="text-2xl font-semibold mt-2">
              {stats.tailoredResumes}
            </h3>

          </div>



          <div className="bg-white border p-6">

            <p className="text-sm text-gray-600">
              ATS Checks
            </p>

            <h3 className="text-2xl font-semibold mt-2">
              {stats.atsChecks}
            </h3>

          </div>



          <div className="bg-white border p-6">

            <p className="text-sm text-gray-600">
              Current Plan
            </p>

            <h3 className="text-2xl font-semibold mt-2">
              {stats.plan}
            </h3>

          </div>

        </div>



        {/* RESUME HISTORY */}

        <div>

          <h4 className="text-sm font-semibold uppercase mb-6">
            Resume History
          </h4>

          {history.length === 0 ? (

            <div className="bg-white border p-6 text-gray-500">
              No resumes created yet.
            </div>

          ) : (

            <div className="space-y-4">

              {history.map((resume) => (

                <div
                  key={resume._id}
                  className="bg-white border p-5 flex justify-between items-center"
                >

                  <div>

                    <p className="font-medium">
                      {resume.title || "Resume"}
                    </p>

                    <p className="text-sm text-gray-500">
                      {new Date(resume.createdAt).toLocaleDateString()}
                    </p>

                  </div>



                  <div className="flex gap-3">

                    <Link
                      to={`/resume/view/${resume._id}`}
                      className="px-4 py-2 bg-gray-100 text-sm"
                    >
                      View
                    </Link>



                    <Link
                      to={`/dashboard/create/${resume._id}`}
                      className="px-4 py-2 bg-blue-600 text-white text-sm"
                    >
                      Edit
                    </Link>



                    <button
                      onClick={() => handleDeleteResume(resume._id)}
                      className="px-4 py-2 bg-red-600 text-white text-sm"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>

  );

}