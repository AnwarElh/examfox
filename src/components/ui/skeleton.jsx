import React from "react";

// Generic skeleton block with shimmer
export function Skeleton({ className = "", rounded = "md", ...props }) {
  const radius =
    rounded === "full" ? "rounded-full" :
    rounded === "sm" ? "rounded-sm" :
    rounded === "lg" ? "rounded-lg" :
    "rounded-md";

  return (
    <div
      className={`relative overflow-hidden bg-gray-200 ${radius} ${className}`}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}