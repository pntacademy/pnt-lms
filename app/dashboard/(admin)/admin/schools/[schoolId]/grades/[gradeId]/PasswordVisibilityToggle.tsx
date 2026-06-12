"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function PasswordVisibilityToggle({ plainPassword }: { plainPassword: string | null }) {
  const [isVisible, setIsVisible] = useState(false);

  if (!plainPassword) {
    return (
      <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
        Unavailable
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-slate-100 pl-2 pr-1 py-1 rounded-md">
      <span className="text-xs text-slate-600 font-mono w-[80px] text-center tracking-wider">
        {isVisible ? plainPassword : "••••••••"}
      </span>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600 transition-colors"
        title={isVisible ? "Hide Password" : "Show Password"}
      >
        {isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  );
}
