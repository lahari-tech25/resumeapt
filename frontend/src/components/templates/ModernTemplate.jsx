import React from "react";

export default function ModernTemplate({ data }) {
  return (
    <div className="w-[794px] min-h-[1123px] bg-white shadow-xl px-12 py-10 font-sans">

      {/* HEADER */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-wide">
          {data.name}
        </h1>

        <div className="mt-3 text-sm text-neutral-600 flex flex-wrap justify-center gap-3">
          {data.phone && <span>{data.phone}</span>}
          {data.email && <span>{data.email}</span>}
          {data.linkedin && <span>{data.linkedin}</span>}
          {data.github && <span>{data.github}</span>}
        </div>
      </div>

      <div className="h-1 bg-black my-6" />

      {/* SUMMARY */}
      {data.summary && (
        <Section title="PROFILE">
          <p className="text-neutral-700 leading-relaxed">
            {data.summary}
          </p>
        </Section>
      )}

      {/* EXPERIENCE */}
      {data.experience.length > 0 && (
        <Section title="EXPERIENCE">
          {data.experience.map((exp, i) => (
            <div key={i} className="mb-6">
              <div className="flex justify-between">
                <h3 className="font-semibold text-lg">
                  {exp.role}
                </h3>
                <span className="text-sm text-neutral-500">
                  {exp.duration}
                </span>
              </div>
              <p className="text-sm font-medium text-neutral-600">
                {exp.company}
              </p>
              <p className="mt-2 text-sm text-neutral-700 leading-relaxed">
                {exp.description}
              </p>
            </div>
          ))}
        </Section>
      )}

      {/* PROJECTS */}
      {data.projects.length > 0 && (
        <Section title="PROJECTS">
          {data.projects.map((p, i) => (
            <div key={i} className="mb-4">
              <h3 className="font-semibold">{p.title}</h3>
              <p className="text-sm text-neutral-700 mt-1">
                {p.description}
              </p>
            </div>
          ))}
        </Section>
      )}

      {/* EDUCATION */}
      {data.education.length > 0 && (
        <Section title="EDUCATION">
          {data.education.map((edu, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between">
  <h3 className="font-semibold">{edu.degree}</h3>
  <span className="text-sm text-neutral-500">
    {edu.duration}
  </span>
</div>
<p className="text-sm text-neutral-600">
  {edu.institution}
  {edu.percentage && ` | ${edu.percentage}`}
</p>
            </div>
          ))}
        </Section>
      )}

      {/* SKILLS */}
      {data.skills.length > 0 && (
  <Section title="SKILLS">
    {data.skills.map((s, i) => (
      <p key={i} className="mb-2">
        <span className="font-semibold">
          {s.category}:
        </span>{" "}
        {s.items}
      </p>
    ))}
  </Section>
)}
{data.achievements && (
  <Section title="ACHIEVEMENTS">
    <p className="text-sm">{data.achievements}</p>
  </Section>
)}

{data.hobbies && (
  <Section title="HOBBIES">
    <p className="text-sm">{data.hobbies}</p>
  </Section>
)}

    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mt-8">
      <h2 className="text-sm tracking-widest font-bold mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}