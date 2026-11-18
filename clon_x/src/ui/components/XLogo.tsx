import { useId } from "react";

interface XLogoProps {
  className?: string;
}

// Nexo logo: an "N" drawn as a small network, two nodes joined by one line,
// because "nexo" means connection. useId keeps the gradient id unique when
// the logo appears more than once on the same page.
export const XLogo = ({ className }: XLogoProps) => {
  // useId can contain symbols like ":" that break url(#...), so they are removed.
  const gradientId = `nexo-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  const paint = `url(#${gradientId})`;

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      role="img"
      aria-label="Nexo"
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="3"
          y1="21"
          x2="21"
          y2="3"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#1d9bf0" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <path
        d="M5.5 18.5V5.5l13 13V5.5"
        fill="none"
        stroke={paint}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="5.5" cy="18.5" r="2.7" fill={paint} />
      <circle cx="18.5" cy="5.5" r="2.7" fill={paint} />
    </svg>
  );
};
