import React, { useEffect, useId, useState } from "react";

export function RadioGroup({
  value,                 // controlled value (optional)
  onValueChange,         // (v) => void
  defaultValue = "",
  className = "",
  children,
  name,                  // optional explicit group name
}) {
  // All hooks at top level, never in conditionals
  const groupName = useId();
  const fieldName = name || groupName;

  const [internal, setInternal] = useState(value ?? defaultValue);

  useEffect(() => {
    if (value !== undefined) setInternal(value);
  }, [value]);

  const set = (v) => {
    setInternal(v);
    onValueChange?.(v);
  };

  return (
    <div role="radiogroup" className={`flex flex-col gap-2 ${className}`}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, {
              name: fieldName,
              checked: (value ?? internal) === child.props.value,
              onSelect: set,
            })
          : child
      )}
    </div>
  );
}

export function RadioGroupItem({
  id,
  value,
  checked = false,
  onSelect,
  name,
  className = "",
  children,
}) {
  // Hooks at top level only
  const autoId = useId();
  const inputId = id || autoId;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <input
        id={inputId}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onSelect?.(value)}
        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      {children ? (
        <label htmlFor={inputId} className="text-sm text-gray-800">
          {children}
        </label>
      ) : null}
    </div>
  );
}
RadioGroupItem.displayName = "RadioGroupItem";

