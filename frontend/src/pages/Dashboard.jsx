import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-blue-200/60 to-blue-100">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Top Navbar */}
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-3xl font-extrabold text-black leading-tight tracking-wide">
            ResumeApt
          </h1>

          {/* Profile Section */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-black font-semibold hover:bg-blue-500 transition"
            >
              L
            </button>

            {/* Profile Dropdown */}
            {menuOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white border border-neutral-200 rounded-xl shadow-lg overflow-hidden z-50">
                <Link
                  to="/subscription"
                  className="block px-4 py-3 text-sm text-gray-800 hover:bg-blue-50"
                >
                  Subscription / Upgrade
                </Link>
                <button
                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Greeting */}
        <div className="mb-10">
          <p className="text-lg text-black">
            Hi, <span className="font-semibold">Lahari</span> 👋
          </p>
          <p className="text-gray-800 ">
            Let’s build something great today.
          </p>
        </div>

        {/* Primary Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">

          <Link
            to="/create-resume"
            className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm 
                       hover:shadow-lg hover:-translate-y-2 transition-all duration-300"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Create Resume
            </h3>
            <p className="text-gray-800 leading-relaxed">
              Build a resume from scratch using AI
            </p>
          </Link>

          <Link
            to="/dashboard/regenerate"
            className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm 
                       hover:shadow-lg hover:-translate-y-2 transition-all duration-300"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Regenerate with Job Description
            </h3>
            <p className="text-gray-800 leading-relaxed">
              Tailor your resume to a specific role
            </p>
          </Link>

          <Link
            to="/dashboard/ats"
            className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm 
                       hover:shadow-lg hover:-translate-y-2 transition-all duration-300"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              ATS Score Check
            </h3>
            <p className="text-gray-800 leading-relaxed">
              See how well your resume matches a job
            </p>
          </Link>

        </div>

         

        {/* Recent Activity */}
        <div className="max-w-3xl">
          <h4 className="text-sm font-semibold text-gray-900 mb-5">
            Recent Activity
          </h4>

          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white border border-neutral-200 rounded-lg px-4 py-3 text-sm">
              <div>
                <p className="font-medium">
                  Frontend Developer Resume
                </p>
                <p className="text-gray-600 text-xs">
                  Updated on Jan 2, 2026
                </p>
              </div>
              <Link
                to="/dashboard/resume/1"
                className="text-blue-600 hover:text-blue-800"
              >
                View
              </Link>
            </div>

            <div className="flex items-center justify-between bg-white border border-neutral-200 rounded-lg px-4 py-3 text-sm">
              <div>
                <p className="font-medium">
                  Software Engineer – Internship
                </p>
                <p className="text-gray-600 text-xs">
                  Updated on Dec 28, 2025
                </p>
              </div>
              <Link
                to="/dashboard/resume/2"
                className="text-blue-600 hover:text-blue-800"
              >
                Continue
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}




