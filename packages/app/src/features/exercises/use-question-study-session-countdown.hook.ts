import { useEffect, useState } from "react";
import type { StudySession } from "@guesant/saberes-application";

export interface UseQuestionStudySessionCountdownInput {
  session: StudySession | null;
}

export function useQuestionStudySessionCountdown(
  input: UseQuestionStudySessionCountdownInput,
): number | null {
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

  useEffect(() => {
    if (!input.session?.expiresAt || input.session.status !== "active") {
      setRemainingSeconds(null);

      return undefined;
    }

    const update = () => {
      const milliseconds = Date.parse(input.session?.expiresAt || "") - Date.now();

      setRemainingSeconds(Math.max(0, Math.ceil(milliseconds / 1000)));
    };

    update();

    const interval = window.setInterval(update, 1000);

    return () => {
      return window.clearInterval(interval);
    };
  }, [input.session?.expiresAt, input.session?.status]);

  return remainingSeconds;
}
