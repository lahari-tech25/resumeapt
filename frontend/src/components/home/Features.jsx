import React from "react";
import { Zap, Monitor, Sliders } from "lucide-react";

const Features = () => {
  const featuresData = [
    {
    icon: <Zap className="w-8 h-8 text-blue-500 mt-4" />,
    title: "Create resumes effortlessly",
    description: "Build professional resumes from scratch with structured sections designed for modern roles.",
  },
  {
    icon: <Sliders className="w-8 h-8 text-blue-500 mt-4" />,
    title: "Optimize resumes for any role",
    description: "Regenerate and customize your resume using job descriptions to align with recruiter expectations.",
  },
  {
    icon: <Monitor className="w-8 h-8 text-blue-500 mt-4" />,
    title: "ATS score & insights",
    description: "Evaluate how well your resume performs in ATS systems and identify areas for improvement.",
  },
  ];

  return (
    <div
      id="features"
      className="flex flex-col items-center my-10 scroll-mt-12"
    >
      {/* Heading */}
      <div className="text-center">
        <p className="font-medium text-white px-10 py-1.5 rounded-full bg-blue-500 border border-blue-600 w-max mx-auto">
          Features
        </p>

        <h2 className="text-3xl font-semibold mt-4 text-black">
          Built for job seekers
        </h2>

        <p className="mt-2 text-slate-700 max-w-xl mx-auto">
          Create Resumes,easy downloads — everything you need to apply job.
        </p>
      </div>

      {/* Feature cards */}
      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-4 mt-10 px-6">
        {featuresData.map((feature, index) => (
          <div
            key={index}
            className="hover:-translate-y-0.5 transition duration-300"

          >
            <div className="p-6 rounded-xl space-y-4 border border-blue-600 bg-slate-100 max-w-80 w-full">
              {feature.icon}

              <h3 className="text-base font-medium text-blue-700">
                {feature.title}
              </h3>

              <p className="text-black-400 pb-4">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
