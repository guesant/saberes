import type { Container } from "inversify";

export function registerPort<T>(container: Container, token: symbol, factory: () => T): void {
  container.bind<T>(token).toDynamicValue(factory).inSingletonScope();
}
