export interface RemoveBookmarkPort {
  execute(contentKey: string): Promise<void>;
}
