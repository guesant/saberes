import type { RemoveBookmarkPort } from "../ports/remove-bookmark-port.port";

export class RemoveBookmarkCommandHandler {
  public constructor(private readonly port: RemoveBookmarkPort) {}

  public execute(contentKey: string): Promise<void> {
    return this.port.execute(contentKey);
  }
}
