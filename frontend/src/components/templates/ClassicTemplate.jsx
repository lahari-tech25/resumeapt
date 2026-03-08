import React from "react";

export default function ClassicTemplate({ data = {} }) {
  const {
    name = "",
    phone = "",
    email = "",
    linkedin = "",
    github = "",
    summary = "",
    experience = [],
    projects = [],
    education = [],
    skills = [],
    achievements = "",
    hobbies = "",
  } = data;

  return (
    <div className="px-4 pt-2 pb-4 font-sans bg-white">
      {/* ===== Name & Contact ===== */}
      <h1 className="text-3xl font-bold text-center">{name || "Your Name"}</h1>

      <p className="text-center text-sm mt-0.5">
        {[phone, email, linkedin, github].filter(Boolean).join(" | ")}
      </p>

      <hr className="my-2 border-gray-300" />

      {/* ===== Sections ===== */}
      {summary && <Section title="Summary">{summary}</Section>}

      {experience.length > 0 && (
        <Section title="Experience">
          {experience.map((exp, i) => (
            <div key={i} className="mb-1">
              <p className="font-semibold">
                {exp.role} - {exp.company}
              </p>
              <p className="text-sm text-gray-500">{exp.duration}</p>
              <p className="text-sm">{exp.description}</p>
            </div>
          ))}
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="Projects">
          {projects.map((p, i) => (
            <div key={i} className="mb-1">
              <p className="font-semibold">{p.title}</p>
              <p className="text-sm">{p.description}</p>
            </div>
          ))}
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education">
          {education.map((edu, i) => (
            <p key={i} className="mb-1">
              {edu.degree} - {edu.institution} ({edu.duration})
              {edu.percentage && ` | ${edu.percentage}`}
            </p>
          ))}
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Skills">
          {skills.map((s, i) => (
            <p key={i} className="text-sm mb-1">
              <span className="font-semibold">{s.category}:</span>{" "}
              {Array.isArray(s.items) ? s.items.join(", ") : s.items}
            </p>
          ))}
        </Section>
      )}

      {achievements && (
        <Section title="Achievements">{achievements}</Section>
      )}

      {hobbies && <Section title="Hobbies">{hobbies}</Section>}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mt-2">
      <h2 className="text-lg font-bold border-b pb-0.5 mb-1">{title}</h2>
      {children}
    </div>
  );
}