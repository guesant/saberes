import { registerPort } from "./register-port.composition";
import type { Container } from "inversify";

export function registerPortFactories(
  container: Container,
  bindings: Iterable<readonly [symbol, () => object]>,
): void {
  for (const [token, factory] of bindings) {
    registerPort(container, token, factory);
  }
}
