import React from "react";

export default function ResultTag({ result }) {
  let color, label;

  if (result === "true") {
    color = "bg-green-500";
    label = "True";
  } else if (result === "false") {
    color = "bg-red-500";
    label = "False";
  } else if (result === "partial") {
    color = "bg-yellow-500";
    label = "Partially True";
  } else {
    return null; // No tag shown
  }

  return (
    <div className={`inline-block px-3 py-1 text-white text-sm rounded-full ${color}`}>
      {label}
    </div>
  );
}
