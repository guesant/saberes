import { applicationDependencyTokens } from "./application-dependency-tokens.config";
import { resolvePort } from "./resolve-port.composition";
import type { ApplicationPortKey } from "./application-port-key.type";
import type { ApplicationPorts } from "@guesant/saberes-application";
import type { Container } from "inversify";

export function resolveApplicationPort<TKey extends ApplicationPortKey>(
  container: Container,
  key: TKey,
): ApplicationPorts[TKey] {
  return resolvePort<ApplicationPorts[TKey]>(container, applicationDependencyTokens[key]);
}
