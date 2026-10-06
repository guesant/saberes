import type { StudySession } from "@guesant/saberes-application";
import type { QueryClient } from "@tanstack/react-query";

export function saveSimulationSessionCache(client: QueryClient, sessionId: string, session: StudySession): void {
  client.setQueryData(["study-session", sessionId], session);
}
