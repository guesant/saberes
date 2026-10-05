import type { PersonalRelationEndpointAvailability } from "./personal-relation-endpoint-availability.type";

export function getPersonalRelationEndpointStatusLabel(
  availability: PersonalRelationEndpointAvailability,
): string | null {
  if (availability === "missing") {
    return "Registro ausente neste dispositivo. O vínculo foi preservado.";
  }

  if (availability === "archived") {
    return "Registro arquivado neste dispositivo.";
  }

  if (availability === "external") {
    return "Referência de estudo: a origem é resolvida na área correspondente.";
  }

  return null;
}
