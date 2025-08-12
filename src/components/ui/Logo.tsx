import React from "react";

type LogoProps = {
  size?: number | string;
  className?: string;
  variant?: "color" | "mono";
};

export default function Logo({ size = 24, className, variant = "color" }: LogoProps) {
  const px = typeof size === "number" ? `${size}px` : size;
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="707 3D logo"
      className={className}
    >
      <defs>
        <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7b61ff" />
          <stop offset="50%" stopColor="#4de0ff" />
          <stop offset="100%" stopColor="#4df18f" />
        </linearGradient>
        <linearGradient id="g2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
        </linearGradient>
        <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g fill="none" stroke="none" filter="url(#softGlow)">
        <path d="M32 4L56 16v32L32 60 8 48V16z" fill={variant === "mono" ? "#ffffff" : "url(#g1)"} opacity={variant === "mono" ? 0.95 : 0.95} />
        <path d="M32 4 8 16v32l24 12V32z" fill="#000" opacity={variant === "mono" ? 0.1 : 0.12} />
        <path d="M32 4 56 16v32L32 32z" fill="#000" opacity={variant === "mono" ? 0.06 : 0.08} />
        {variant === "mono" ? (
          <path d="M10 18 32 8l22 10-22 11z" fill="#ffffff" opacity="0.12" />
        ) : (
          <path d="M10 18 32 8l22 10-22 11z" fill="url(#g2)" opacity="0.7" />
        )}
        <circle cx="32" cy="32" r="30" stroke={variant === "mono" ? "#ffffff" : "url(#g1)"} strokeOpacity={variant === "mono" ? 0.2 : 0.35} strokeWidth="1" />
      </g>
    </svg>
  );
}


