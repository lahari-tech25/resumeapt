import React from "react";

const ProgressBar = ({ label, value }) => {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="w-full bg-gray-200 h-3 rounded">
        <div
          className="bg-blue-600 h-3 rounded transition-all duration-700"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;