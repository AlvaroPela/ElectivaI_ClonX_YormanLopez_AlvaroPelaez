interface XLogoProps {
  className?: string;
}

export const XLogo = ({ className }: XLogoProps) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    role="img"
    aria-label="Nexo"
  >
    <path fill="currentColor" d="M3.5 3.25A2.25 2.25 0 0 1 5.75 1h12.5A2.25 2.25 0 0 1 20.5 3.25v7.5a2.25 2.25 0 0 1-2.25 2.25H11l-5.2 4.75a.75.75 0 0 1-1.25-.56V13A2.25 2.25 0 0 1 2.3 10.75V4.5a1.25 1.25 0 0 1 1.2-1.25Zm3.25 3.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm5 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm5 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
  </svg>
);
