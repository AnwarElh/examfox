import React from "react";

export function Card({ className = "", ...props }) {
  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}
      {...props}
    />
  );
}

export function CardHeader({ className = "", ...props }) {
  return (
    <div className={`p-4 border-b border-gray-100 ${className}`} {...props} />
  );
}

export function CardTitle({ className = "", children, as: Tag = "h3", ...props }) {
  return (
    <Tag
      className={`text-lg font-semibold leading-6 text-gray-900 ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function CardContent({ className = "", ...props }) {
  return <div className={`p-4 ${className}`} {...props} />;
}

export function CardFooter({ className = "", ...props }) {
  return (
    <div className={`p-4 border-t border-gray-100 ${className}`} {...props} />
  );
}
