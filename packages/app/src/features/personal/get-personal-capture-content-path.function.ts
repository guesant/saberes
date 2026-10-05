export function getPersonalCaptureContentPath(contentKey: string | undefined): string | null {
  if (!contentKey) {
    return null;
  }

  const [recordType, recordId] = contentKey.split(":", 2);

  const routeSegments = new Map<string, string>([
    ["question", "questoes"],
    ["lesson", "licoes"],
    ["topic", "topicos"],
  ]);

  const routeSegment = routeSegments.get(recordType);

  if (!recordId || !routeSegment) {
    return null;
  }

  return `/${routeSegment}/${recordId}`;
}
