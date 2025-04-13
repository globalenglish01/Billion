import React from "react";

export function Button({ children, onClick, disabled, className }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 bg-blue-500 text-white rounded ${className}`}
    >
      {children}
    </button>
  );
}
