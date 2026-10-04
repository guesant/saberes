import type { PortFactory } from "./port-factory.type";
import type { Container } from "inversify";

export function registerPort<T>(
  container: Container,
  token: symbol,
  factory: PortFactory<T>,
): void {
  container.bind<T>(token)
    .toDynamicValue(factory)
    .inSingletonScope();
}
