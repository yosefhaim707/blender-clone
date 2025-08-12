import React from "react";

type Variant = "neutral" | "primary" | "danger" | "toggle";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  active?: boolean; // used for toggle variant
  fullWidth?: boolean;
};

export default function Button({ variant = "neutral", active = false, fullWidth = false, className = "", children, ...rest }: Props) {
  const base = "inline-flex items-center justify-center rounded-md font-semibold text-[13px] h-8 px-3 min-w-[52px] border transition-all duration-150 select-none whitespace-nowrap";
  let theme = "";
  if (variant === "primary") {
    theme = "bg-[#edeafe] border-[#e7e3ff] text-[#1a1030] hover:bg-[#e6e1ff] active:bg-[#ded7ff]";
  } else if (variant === "danger") {
    theme = "bg-[#fff3f3] border-[#ffd1d1] text-[#7d1c1c] hover:bg-[#ffe9e9] active:bg-[#ffe0e0]";
  } else if (variant === "toggle") {
    theme = active
      ? "bg-[#edeafe] border-[#e7e3ff] text-[#1a1030] shadow-inner"
      : "bg-white border-[#e7e3ff] text-[#1a1030] hover:bg-[#f5f2ff]";
  } else {
    theme = "bg-white border-[#e7e3ff] text-[#1a1030] hover:bg-[#f5f2ff]";
  }
  const width = fullWidth ? "w-full" : "";
  return (
    <button className={`${base} ${theme} ${width} ${className}`} {...rest}>{children}</button>
  );
}


