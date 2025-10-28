import React from "react";

export function Textarea({ value, onChange, placeholder, rows = 3, ...props }) {
  return (
    <textarea
      className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      {...props}
    />
  );
}
