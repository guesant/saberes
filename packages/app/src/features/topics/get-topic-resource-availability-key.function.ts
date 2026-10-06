export function getTopicResourceAvailabilityKey(isExternal: boolean) {
  if (isExternal) {
    return "discovery.externalResource";
  }

  return "discovery.localResource";
}
