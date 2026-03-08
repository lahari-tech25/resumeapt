import React, { useEffect, useState } from "react";

const ScoreCircle = ({ score }) => {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const interval = setInterval(() => {
      start += 1;
      setDisplayScore(start);
      if (start >= score) clearInterval(interval);
    }, 15);
  }, [score]);

  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="80"
          cy="80"
          r="70"
          stroke="#e5e7eb"
          strokeWidth="12"
          fill="none"
        />
        <circle
          cx="80"
          cy="80"
          r="70"
          stroke="#2563eb"
          strokeWidth="12"
          fill="none"
          strokeDasharray={440}
          strokeDashoffset={440 - (440 * displayScore) / 100}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold">
        {displayScore}%
      </div>
    </div>
  );
};

export default ScoreCircle;