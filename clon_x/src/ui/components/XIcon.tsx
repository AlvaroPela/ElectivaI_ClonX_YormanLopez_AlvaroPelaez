import type { ReactNode } from "react";

export type XIconName =
  | "home"
  | "search"
  | "notifications"
  | "messages"
  | "bookmark"
  | "profile"
  | "more"
  | "reply"
  | "repost"
  | "like"
  | "share"
  | "camera";

const drawings: Record<XIconName, ReactNode> = {
  home: (
    <>
      <path d="m3 10 9-7 9 7" />
      <path d="M5.5 9v11h13V9M9 20v-6h6v6" />
    </>
  ),
  search: (
    <>
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  notifications: (
    <>
      <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </>
  ),
  messages: (
    <>
      <path d="M4.5 5.5h15a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 3v-3.5a2 2 0 0 1-1.5-2v-8a2 2 0 0 1 2-2.5Z" />
      <path d="M7.5 10h9M7.5 14h6" />
    </>
  ),
  bookmark: <path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-4-6 4V4.5Z" />,
  profile: (
    <>
      <circle cx="12" cy="7.5" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  more: (
    <>
      <circle cx="5" cy="12" r="1.2" fill="currentColor" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
      <circle cx="19" cy="12" r="1.2" fill="currentColor" />
    </>
  ),
  reply: <path d="m10 8-6 5 6 5v-3c5.5 0 8.5 1.5 10 4-.5-5-3-8-10-8V8Z" />,
  repost: (
    <>
      <path d="M17 3 21 7l-4 4" />
      <path d="M3 11V9a2 2 0 0 1 2-2h16M7 21l-4-4 4-4" />
      <path d="M21 13v2a2 2 0 0 1-2 2H3" />
    </>
  ),
  like: (
    <path d="M20.8 8.8c0 5.3-8.8 11-8.8 11s-8.8-5.7-8.8-11A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.8 2.7Z" />
  ),
  share: (
    <>
      <path d="M14 4h6v6" />
      <path d="m20 4-9 9" />
      <path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8h3l1.5-2h7L17 8h3v11H4V8Z" />
      <circle cx="12" cy="13.5" r="3.2" />
    </>
  ),
};

interface XIconProps {
  name: XIconName;
  className?: string;
}

export const XIcon = ({ name, className }: XIconProps) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    {drawings[name]}
  </svg>
);
