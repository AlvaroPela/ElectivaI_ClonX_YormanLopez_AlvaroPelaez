import { useEffect, useState } from "react";

const visibleTime = 4000;

interface SuccessToastProps {
  message: string;
}

// Small message that confirms an action and hides itself after a few seconds.
// The parent gives it a new key to show it again with a new message.
export const SuccessToast = ({ message }: SuccessToastProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), visibleTime);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="x-toast" role="status">
      {message}
    </div>
  );
};
