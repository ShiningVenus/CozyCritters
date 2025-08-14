import React from "react";

interface NavButtonProps<T extends string> {
  id: T;
  label: string;
  currentView: T;
  onSelect: (view: T) => void;
}

export function NavButton<T extends string>({ id, label, currentView, onSelect }: NavButtonProps<T>) {
  const baseClasses =
    "px-3 py-2 rounded-full text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50";
  const activeClasses =
    currentView === id ? "bg-white bg-opacity-20" : "hover:bg-white hover:bg-opacity-10";

  return (
    <button
      onClick={() => onSelect(id)}
      aria-pressed={currentView === id}
      className={`${baseClasses} ${activeClasses}`}
    >
      {label}
    </button>
  );
}

