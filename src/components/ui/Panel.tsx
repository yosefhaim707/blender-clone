import React from "react";

type PanelProps = {
  title?: string;
  className?: string;
  children: React.ReactNode;
};

export default function Panel({ title, className = "", children }: PanelProps) {
  return (
    <div className={`rounded-lg border border-[#e7e3ff] bg-white/90 backdrop-blur p-2 shadow-[0_6px_24px_rgba(123,97,255,0.12)] text-[#1a1030] ${className}`}>
      {title ? (
        <div className="text-[11px] font-semibold tracking-wide mb-1.5 text-[#3b2c7f]">{title}</div>
      ) : null}
      {children}
    </div>
  );
}


