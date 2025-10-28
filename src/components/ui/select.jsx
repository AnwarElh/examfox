import React, { useEffect, useRef, useState } from "react";

// Root: manages open state and selected value via context-like props passing
export function Select({ value, onValueChange, children, defaultOpen = false, className = "" }) {
  const [open, setOpen] = useState(defaultOpen);
  const [selected, setSelected] = useState(value ?? "");

  // keep controlled if parent passes value
  useEffect(() => {
    if (value !== undefined) setSelected(value);
  }, [value]);

  const api = {
    open,
    setOpen,
    selected,
    setSelected: (v) => {
      setSelected(v);
      onValueChange?.(v);
      setOpen(false);
    },
  };

  return (
    <div className={`relative inline-block text-left ${className}`}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child) ? React.cloneElement(child, { __select: api }) : child
      )}
    </div>
  );
}

// Trigger: button that shows current value or placeholder
export function SelectTrigger({ children, className = "", __select }) {
  const label =
    children && typeof children !== "string"
      ? React.Children.map(children, (c) =>
          React.isValidElement(c) && c.type?.displayName === "SelectValue" ? c : null
        )
      : children;

  return (
    <button
      type="button"
      onClick={() => __select.setOpen(!__select.open)}
      className={`flex w-full items-center justify-between gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    >
      <span className="truncate">
        {React.Children.count(label) ? label : (__select.selected || "")}
      </span>
      <svg className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
      </svg>
    </button>
  );
}
SelectTrigger.displayName = "SelectTrigger";

// Value placeholder renderer
export function SelectValue({ placeholder = "Select...", __select }) {
  return <span className="text-gray-500">{__select?.selected || placeholder}</span>;
}
SelectValue.displayName = "SelectValue";

// Dropdown content
export function SelectContent({ children, className = "", align = "start", __select }) {
  const ref = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) __select.setOpen(false);
    }
    if (__select.open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [__select.open]);

  if (!__select.open) return null;

  // basic placement
  const alignment = align === "end" ? "right-0" : "left-0";

  return (
    <div
      ref={ref}
      className={`absolute z-50 mt-1 w-full min-w-[12rem] rounded-md border border-gray-200 bg-white p-1 shadow-lg ${alignment} ${className}`}
    >
      <div className="max-h-60 overflow-auto">
        {React.Children.map(children, (child) =>
          React.isValidElement(child) ? React.cloneElement(child, { __select }) : child
        )}
      </div>
    </div>
  );
}
SelectContent.displayName = "SelectContent";

// Option item
export function SelectItem({ value, children, className = "", __select }) {
  const active = __select?.selected === value;
  return (
    <button
      type="button"
      onClick={() => __select.setSelected(value)}
      className={`flex w-full cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-left text-sm hover:bg-gray-100 ${
        active ? "bg-blue-50 text-blue-700" : "text-gray-800"
      } ${className}`}
    >
      {children}
    </button>
  );
}
SelectItem.displayName = "SelectItem";

