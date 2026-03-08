import Groq from "groq-sdk";

export const generateAIResume = async (resumeText, jobDescription) => {
  
  // ==============================
  // INPUT VALIDATION
  // ==============================
  if (!resumeText || !jobDescription) {
    throw new Error("Resume text or job description missing");
  }

  const provider =
    process.env.NODE_ENV === "development"
      ? "mock"
      : process.env.AI_PROVIDER || "groq";

  // ==============================
  // MOCK MODE (No AI Cost)
  // ==============================
  if (provider === "mock") {
    console.log("Using MOCK mode - No Groq tokens consumed");

    return {
      name: "John Doe",
      phone: "123-456-7890",
      email: "john@example.com",
      linkedin: "linkedin.com/in/johndoe",
      github: "github.com/johndoe",
      summary:
        "Results-driven Frontend Developer with experience in React.js and modern JavaScript.",

      experience: [
        {
          role: "Frontend Developer",
          company: "Tech Company",
          duration: "2022 - Present",
          description:
            "Built responsive web applications using React and optimized performance."
        }
      ],

      projects: [
        {
          title: "Portfolio Website",
          description:
            "Developed a responsive portfolio using React and Tailwind CSS."
        }
      ],

      education: [
        {
          degree: "B.Tech in Computer Science",
          institution: "XYZ University",
          duration: "2018 - 2022",
          percentage: "8.5 CGPA"
        }
      ],

      skills: [
        {
          category: "Frontend",
          items: "React.js, JavaScript, HTML, CSS"
        }
      ],

      achievements: "Won Best Developer Award",
      hobbies: "Reading, Coding"
    };
  }

  // ==============================
  // GROQ MODE
  // ==============================
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing in environment variables");
  }

  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
  });

  // Prevent very large prompts
  const safeResume = resumeText.slice(0, 2500);
  const safeJD = jobDescription.slice(0, 1500);

  let response;

  try {
    response = await Promise.race([
      groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content:
              "You are an expert resume optimization assistant. Return ONLY valid JSON."
          },
          {
            role: "user",
            content: `
Rewrite and optimize the resume to match the job description.

Return ONLY valid JSON in this exact format:

{
  "name": "",
  "phone": "",
  "email": "",
  "linkedin": "",
  "github": "",
  "summary": "",
  "experience": [
    {
      "role": "",
      "company": "",
      "duration": "",
      "description": ""
    }
  ],
  "projects": [
    {
      "title": "",
      "description": ""
    }
  ],
  "education": [
    {
      "degree": "",
      "institution": "",
      "duration": "",
      "percentage": ""
    }
  ],
  "skills": [
    {
      "category": "",
      "items": ""
    }
  ],
  "achievements": "",
  "hobbies": ""
}

RESUME:
${safeResume}

JOB DESCRIPTION:
${safeJD}
`
          }
        ],
        max_tokens: 800,
        temperature: 0.5
      }),

      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("AI request timeout")), 15000)
      )
    ]);
  } catch (error) {
    console.error("AI request failed:", error);
    throw new Error("AI service unavailable");
  }

  const rawOutput = response.choices[0].message.content;

  // ==============================
  // CLEAN AI RESPONSE
  // ==============================
  const cleanedOutput = rawOutput
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .replace(/^[^{]*/, "")
    .replace(/[^}]*$/, "")
    .trim();

  let parsedOutput;

  try {
    parsedOutput = JSON.parse(cleanedOutput);
  } catch (err) {
    console.error("AI returned invalid JSON:", cleanedOutput);
    throw new Error("Invalid AI response format");
  }

  // ==============================
  // SAFETY DEFAULTS
  // ==============================
  parsedOutput.experience = parsedOutput.experience || [];
  parsedOutput.projects = parsedOutput.projects || [];
  parsedOutput.education = parsedOutput.education || [];
  parsedOutput.skills = parsedOutput.skills || [];

  return parsedOutput;
};