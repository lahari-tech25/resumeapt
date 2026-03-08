// utils/atsEngine.js

// ==============================
// 1. CLEAN TEXT
// ==============================
function cleanText(text = "") {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ==============================
// 2. SYNONYM MAP
// ==============================
const synonyms = {
  js: "javascript",
  reactjs: "react",
  nodejs: "node",
  mongodb: "mongo",
  expressjs: "express",
  ml: "machinelearning",
  ai: "artificialintelligence",
};

function applySynonyms(text) {
  Object.keys(synonyms).forEach((key) => {
    const regex = new RegExp(`\\b${key}\\b`, "g");
    text = text.replace(regex, synonyms[key]);
  });
  return text;
}

// ==============================
// 3. SECTION DETECTION
// ==============================
function extractSections(text) {
  const lines = text.split("\n");

  let sections = {
    skills: "",
    experience: "",
    education: "",
    projects: "",
    others: "",
  };

  let current = "others";

  lines.forEach((line) => {
    const l = line.toLowerCase();

    if (l.includes("skill")) current = "skills";
    else if (l.includes("experience")) current = "experience";
    else if (l.includes("education")) current = "education";
    else if (l.includes("project")) current = "projects";

    sections[current] += " " + line;
  });

  return sections;
}

// ==============================
// 4. KEYWORD EXTRACTION
// ==============================
function extractKeywords(jobDescription) {
  const cleaned = cleanText(jobDescription);
  const words = cleaned.split(" ");

  // Remove small words and limit keywords
  const filtered = [...new Set(words.filter((w) => w.length > 3))];

  return filtered.slice(0, 60); // limit keywords for performance
}

// ==============================
// 5. LEVENSHTEIN (FUZZY MATCH)
// ==============================
function levenshtein(a, b) {
  const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);

  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] =
          1 +
          Math.min(
            matrix[i - 1][j],
            matrix[i][j - 1],
            matrix[i - 1][j - 1]
          );
      }
    }
  }

  return matrix[b.length][a.length];
}

function fuzzyMatch(word, textWords) {
  for (let tw of textWords) {
    if (!tw) continue;
    if (levenshtein(word, tw) <= 2) return true;
  }
  return false;
}

// ==============================
// 6. MAIN ATS ENGINE
// ==============================
export function runATS(resumeText, jobDescription) {

  // Input safety
  if (!resumeText || !jobDescription) {
    return {
      totalScore: 0,
      sectionBreakdown: {},
      matchedKeywords: [],
      missingKeywords: [],
    };
  }

  let cleanedResume = applySynonyms(cleanText(resumeText));
  let cleanedJD = applySynonyms(cleanText(jobDescription));

  const sections = extractSections(cleanedResume);
  const keywords = extractKeywords(cleanedJD);

  const weights = {
    skills: 40,
    experience: 30,
    education: 15,
    projects: 10,
    others: 5,
  };

  let sectionBreakdown = {};
  let matched = [];

  Object.keys(weights).forEach((section) => {
    const sectionText = sections[section] || "";
    const words = sectionText.split(" ");
    let count = 0;

    keywords.forEach((keyword) => {
      if (
        sectionText.includes(keyword) ||
        fuzzyMatch(keyword, words)
      ) {
        count++;
        matched.push(keyword);
      }
    });

    const percent = keywords.length
      ? (count / keywords.length) * 100
      : 0;

    sectionBreakdown[section] = Math.round(percent);
  });

  // ==============================
  // FINAL ATS SCORE
  // ==============================
  const totalScore = Math.round(
    Object.keys(weights).reduce((acc, section) => {
      return acc + (sectionBreakdown[section] * weights[section]) / 100;
    }, 0)
  );

  const uniqueMatched = [...new Set(matched)];
  const missingKeywords = keywords.filter(
    (k) => !uniqueMatched.includes(k)
  );

  return {
    totalScore,
    sectionBreakdown,
    matchedKeywords: uniqueMatched,
    missingKeywords,
  };
}