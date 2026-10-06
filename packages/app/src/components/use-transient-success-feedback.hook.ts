import { useEffect, useState } from "react";

export function useTransientSuccessFeedback(isSuccessful: boolean): boolean {
  const [visible, setVisible] = useState(isSuccessful);

  useEffect(() => {
    if (isSuccessful) {
      setVisible(true);

      const timeout = window.setTimeout(() => {
        setVisible(false);
      }, 3000);

      return () => {
        window.clearTimeout(timeout);
      };
    }

    setVisible(false);

    return () => {};
  }, [isSuccessful]);

  return visible;
}
