import {
  Bell,
  Bookmark,
  Camera,
  Ellipsis,
  Heart,
  House,
  Mail,
  MessageCircle,
  Repeat2,
  Search,
  Share,
  User,
  type LucideIcon,
} from "lucide-react";

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

// Each icon name of the app points to one icon of the lucide-react library,
// so the components keep using names and the library can be changed in one place.
const icons: Record<XIconName, LucideIcon> = {
  home: House,
  search: Search,
  notifications: Bell,
  messages: Mail,
  bookmark: Bookmark,
  profile: User,
  more: Ellipsis,
  reply: MessageCircle,
  repost: Repeat2,
  like: Heart,
  share: Share,
  camera: Camera,
};

interface XIconProps {
  name: XIconName;
  className?: string;
}

export const XIcon = ({ name, className }: XIconProps) => {
  const Icon = icons[name];

  return (
    <Icon
      className={className}
      strokeWidth={1.8}
      aria-hidden="true"
      focusable="false"
    />
  );
};
