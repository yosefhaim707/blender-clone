import React from "react";

type Props = {
  side: "left" | "right";
  open: boolean;
  onToggle: () => void;
  width?: number; // px
  children: React.ReactNode;
};

export default function Sidebar({ side, open, onToggle, width = 320, children }: Props) {
  const isLeft = side === "left";
  const translateClass = open ? "translate-x-0" : (isLeft ? "-translate-x-full" : "translate-x-full");
  const baseSide = isLeft ? "left-0" : "right-0";
  const handleArrow = isLeft ? (open ? "‹" : "›") : (open ? "›" : "‹");

  return (
    <>
      <div
        className={`fixed top-11 bottom-3 z-[60] ${baseSide} ${translateClass} transition-transform duration-200`}
        style={{ width }}
      >
        <div
          className={`h-full overflow-auto p-3 bg-white/85 backdrop-blur-md border border-[#e7e3ff] ${isLeft?"rounded-r-lg":"rounded-l-lg"} shadow-[0_8px_30px_rgba(123,97,255,0.15)]`}
        >
          {children}
        </div>
      </div>
      {(() => {
        const baseClasses = "fixed top-1/2 -translate-y-1/2 z-[70] h-8 w-8 flex items-center justify-center border bg-white/95 backdrop-blur shadow focus:outline-none focus:ring-2 focus:ring-indigo-500";
        const closedClasses = "rounded-full border-gray-200";
        const attachedLeft = "rounded-l-none rounded-r-md border-gray-200 border-l-0";
        const attachedRight = "rounded-r-none rounded-l-md border-gray-200 border-r-0";
        const styleObj = isLeft
          ? (open ? { left: width - 1 } : { left: 8 })
          : (open ? { right: width - 1 } : { right: 8 });
        const classes = open
          ? `${baseClasses} ${isLeft ? attachedLeft : attachedRight}`
          : `${baseClasses} ${closedClasses}`;
        return (
          <button
            className={classes}
            style={styleObj as React.CSSProperties}
            onClick={onToggle}
            aria-label={open ? "Hide sidebar" : "Show sidebar"}
          >{handleArrow}</button>
        );
      })()}
    </>
  );
}


