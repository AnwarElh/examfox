import React, { useState } from "react";

export function Tabs({ defaultTab, children }) {
  const [active, setActive] = useState(defaultTab);
  return <div>{React.Children.map(children, child =>
    React.cloneElement(child, { active, setActive })
  )}</div>;
}

export function TabsList({ children }) {
  return <div className="flex border-b mb-2">{children}</div>;
}

export function TabsTrigger({ value, active, setActive, children }) {
  const isActive = active === value;
  return (
    <button
      className={`px-4 py-2 -mb-px border-b-2 ${
        isActive ? "border-blue-500 text-blue-600" : "border-transparent"
      }`}
      onClick={() => setActive(value)}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, active, children }) {
  return active === value ? <div>{children}</div> : null;
}
