import React from "react";

export default function ModernTemplate({ data = {} }) {
  const experience = data.experience || [];
  const projects = data.projects || [];
  const education = data.education || [];
  const skills = data.skills || [];

  return (
    <div className="px-4 pt-2 pb-4 font-sans bg-white">
      {/* HEADER */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-wide">
          {data.name || "Your Name"}
        </h1>

        <div className="mt-1 text-sm text-neutral-600 flex flex-wrap justify-center gap-2">
          {data.phone && <span>{data.phone}</span>}
          {data.email && <span>{data.email}</span>}
          {data.linkedin && <span>{data.linkedin}</span>}
          {data.github && <span>{data.github}</span>}
        </div>
      </div>

      <div className="h-1 bg-black my-3" />

      {/* SECTIONS */}
      {data.summary && (
        <Section title="PROFILE">
          <p className="text-neutral-700 leading-relaxed">{data.summary}</p>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="EXPERIENCE">
          {experience.map((exp, i) => (
            <div key={i} className="mb-2">
              <div className="flex justify-between">
                <h3 className="font-semibold text-lg">{exp.role}</h3>
                <span className="text-sm text-neutral-500">{exp.duration}</span>
              </div>
              <p className="text-sm font-medium text-neutral-600">{exp.company}</p>
              <p className="mt-1 text-sm text-neutral-700 leading-relaxed">
                {exp.description}
              </p>
            </div>
          ))}
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="PROJECTS">
          {projects.map((p, i) => (
            <div key={i} className="mb-1">
              <h3 className="font-semibold">{p.title}</h3>
              <p className="text-sm text-neutral-700 mt-0.5">{p.description}</p>
            </div>
          ))}
        </Section>
      )}

      {education.length > 0 && (
        <Section title="EDUCATION">
          {education.map((edu, i) => (
            <div key={i} className="mb-1">
              <div className="flex justify-between">
                <h3 className="font-semibold">{edu.degree}</h3>
                <span className="text-sm text-neutral-500">{edu.duration}</span>
              </div>
              <p className="text-sm text-neutral-600">
                {edu.institution}
                {edu.percentage && ` | ${edu.percentage}`}
              </p>
            </div>
          ))}
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="SKILLS">
          {skills.map((s, i) => (
            <p key={i} className="mb-1">
              <span className="font-semibold">{s.category}:</span>{" "}
              {Array.isArray(s.items) ? s.items.join(", ") : s.items}
            </p>
          ))}
        </Section>
      )}

      {data.achievements && (
        <Section title="ACHIEVEMENTS">{data.achievements}</Section>
      )}

      {data.hobbies && <Section title="HOBBIES">{data.hobbies}</Section>}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mt-2">
      <h2 className="text-sm tracking-widest font-bold mb-1">{title}</h2>
      {children}
    </div>
  );
}