import type { PersonalRelationEndpoint } from "@guesant/saberes-application";

export function getPersonalRelationEndpointPath(endpoint: PersonalRelationEndpoint): string {
  const encodedId = encodeURIComponent(endpoint.id);

  if (endpoint.recordType === "topic") {
    return `/topicos/${encodedId}`;
  }

  return `/meu-espaco#personal-${endpoint.recordType}-${encodedId}`;
}
