interface XLogoProps {
  className?: string;
}

export const XLogo = ({ className }: XLogoProps) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    role="img"
    aria-label="X"
  >
    <path
      fill="currentColor"
      d="M18.9 2H22l-6.78 7.75L23.2 22h-6.25l-4.9-7.63L5.37 22H2.24l7.25-8.28L1.8 2h6.4l4.43 6.97L18.9 2Zm-1.1 17.86h1.73L7.28 4.03H5.42L17.8 19.86Z"
    />
  </svg>
);
