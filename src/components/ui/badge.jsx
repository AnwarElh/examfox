import React from "react";

export function Badge({ children, color = "blue", variant = "soft", className = "", ...props }) {
  const colorMap = {
    blue: "text-blue-700 bg-blue-100 ring-blue-200",
    gray: "text-gray-700 bg-gray-100 ring-gray-200",
    green: "text-green-700 bg-green-100 ring-green-200",
    red: "text-red-700 bg-red-100 ring-red-200",
    purple: "text-purple-700 bg-purple-100 ring-purple-200",
    yellow: "text-yellow-800 bg-yellow-100 ring-yellow-200",
  };

  const solidMap = {
    blue: "text-white bg-blue-600 ring-blue-600",
    gray: "text-white bg-gray-600 ring-gray-600",
    green: "text-white bg-green-600 ring-green-600",
    red: "text-white bg-red-600 ring-red-600",
    purple: "text-white bg-purple-600 ring-purple-600",
    yellow: "text-black bg-yellow-400 ring-yellow-400",
  };

  const palette = variant === "solid" ? solidMap : colorMap;
  const colorClasses = palette[color] || palette.blue;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${colorClasses} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
