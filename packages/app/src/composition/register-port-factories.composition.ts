import { registerPort } from "./register-port.composition";
import type { PortFactoryBinding } from "./port-factory-binding.type";
import type { Container } from "inversify";

export function registerPortFactories(
  container: Container,
  bindings: Iterable<PortFactoryBinding>,
): void {
  for (const [token, factory] of bindings) {
    registerPort(container, token, factory);
  }
}
