import React from "react";

export default function A4Page({ children }) {
  return (
    <div
      style={{
        width: "210mm",
        height: "297mm",
        background: "white",
        padding: "20mm",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
      className="shadow-lg"
    >
      {children}
    </div>
  );
}