import React from "react";


export default function ClassicTemplate({ data }) {
  return (
    <div className="w-[794px] min-h-[1123px] bg-white shadow-xl p-10 font-sans">

      <h1 className="text-3xl font-bold text-center">{data.name}</h1>

      <p className="text-center text-sm mt-2">
        {data.phone} | {data.email} | {data.linkedin} | {data.github}
      </p>

      <hr className="my-4" />

      {data.summary && <Section title="Summary">{data.summary}</Section>}

      {data.experience.length > 0 && (
        <Section title="Experience">
          {data.experience.map((exp, i) => (
            <div key={i} className="mb-3">
              <p className="font-semibold">{exp.role} - {exp.company}</p>
              <p className="text-sm text-gray-500">{exp.duration}</p>
              <p className="text-sm">{exp.description}</p>
            </div>
          ))}
        </Section>
      )}

      {data.projects.length > 0 && (
        <Section title="Projects">
          {data.projects.map((p, i) => (
            <div key={i}>
              <p className="font-semibold">{p.title}</p>
              <p className="text-sm">{p.description}</p>
            </div>
          ))}
        </Section>
      )}

      {data.education.length > 0 && (
        <Section title="Education">
          {data.education.map((edu, i) => (
            <p key={i}>
  {edu.degree} - {edu.institution} ({edu.duration})
  {edu.percentage && ` | ${edu.percentage}`}
</p>
          ))}
        </Section>
      )}

      {data.skills.length > 0 && (
  <Section title="Skills">
    {data.skills.map((s, i) => (
      <p key={i} className="text-sm mb-1">
        <span className="font-semibold">
          {s.category}:
        </span>{" "}
        {s.items}
      </p>
    ))}
  </Section>
)}
{data.achievements && (
  <Section title="Achievements">
    <p className="text-sm">{data.achievements}</p>
  </Section>
)}

{data.hobbies && (
  <Section title="Hobbies">
    <p className="text-sm">{data.hobbies}</p>
  </Section>
)}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold border-b pb-1 mb-2">{title}</h2>
      {children}
    </div>
  );
}