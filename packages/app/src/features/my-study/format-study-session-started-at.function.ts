import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatStudySessionStartedAt(
  startedAt: string | undefined,
  fallback: string,
): string {
  return startedAt ? format(new Date(startedAt), "dd/MM/yyyy HH:mm", { locale: ptBR }) : fallback;
}
