import React from "react";

export default function TwoColumnTemplate({ data }) {
  return (
    <div className=" flex p-10 font-sans">

      {/* LEFT SIDEBAR */}
      <div className="w-1/3 bg-neutral-100 p-6">

        <h1 className="text-xl font-bold">{data.name}</h1>

        <p className="text-sm mt-3">{data.phone}</p>
        <p className="text-sm">{data.email}</p>
        <p className="text-sm">{data.linkedin}</p>
        <p className="text-sm">{data.github}</p>

        {/* EDUCATION */}
        {data.education.length > 0 && (
          <div className="mt-6">
            <h2 className="font-semibold mb-2">Education</h2>

            {data.education.map((edu, i) => (
              <div key={i} className="mb-3">
                <p className="text-sm font-medium">
                  {edu.degree} - {edu.institution}
                </p>
                <p className="text-sm text-gray-500">
                  {edu.duration}
                  {edu.percentage && ` | ${edu.percentage}`}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* SKILLS */}
        {data.skills.length > 0 && (
          <div className="mt-6">
            <h2 className="font-semibold mb-2">Skills</h2>

            {data.skills.map((s, i) => (
              <p key={i} className="text-sm mb-2">
                <span className="font-semibold">
                  {s.category}:
                </span>{" "}
                {s.items}
              </p>
            ))}
          </div>
        )}

      </div>

      {/* RIGHT CONTENT */}
      <div className="w-2/3 p-8">

        {data.summary && (
          <div className="mb-6">
            <h2 className="font-semibold mb-2">Profile</h2>
            <p className="text-sm">{data.summary}</p>
          </div>
        )}

        {data.experience.length > 0 && (
          <div>
            <h2 className="font-semibold mb-3">Experience</h2>

            {data.experience.map((exp, i) => (
              <div key={i} className="mb-4">
                <p className="font-semibold">
                  {exp.role} - {exp.company}
                </p>
                <p className="text-sm text-gray-500">
                  {exp.duration}
                </p>
                <p className="text-sm">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        )}
        {data.achievements && (
  <div className="mt-6">
    <h2 className="font-semibold mb-2">Achievements</h2>
    <p className="text-sm">{data.achievements}</p>
  </div>
)}

{data.hobbies && (
  <div className="mt-6">
    <h2 className="font-semibold mb-2">Hobbies</h2>
    <p className="text-sm">{data.hobbies}</p>
  </div>
)}

      </div>

    </div>
  );
}