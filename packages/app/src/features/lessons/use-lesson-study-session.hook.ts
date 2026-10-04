import { useEffect } from "react";
import type { ApplicationServices } from "@guesant/saberes-application";

export type UseLessonStudySessionInput = {
  services: ApplicationServices;
  contentKey: string;
  enabled: boolean;
};

export function useLessonStudySession(input: UseLessonStudySessionInput): void {
  useEffect(() => {
    if (!input.enabled) {
      return () => {
        return undefined;
      };
    }

    const startedAt = Date.now();

    const sessionId = input.services.platform.ids.execute();

    return () => {
      const completedAt = Date.now();

      const durationMs = completedAt - startedAt;

      input.services.progress.saveSession
        .execute({
          id: sessionId,
          contentKey: input.contentKey,
          activityType: "lesson",
          startedAt: new Date(startedAt)
            .toISOString(),
          completedAt: new Date(completedAt)
            .toISOString(),
          durationMs,
        })
        .catch(() => {
          return undefined;
        });
    };
  }, [input.contentKey, input.enabled, input.services]);
}
