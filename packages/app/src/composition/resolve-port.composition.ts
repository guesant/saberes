import { Container } from "inversify";

export function resolvePort<T>(container: Container, token: symbol): T {
  return container.get<T>(token);
}
