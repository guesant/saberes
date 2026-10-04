export interface ImportProgressPort {
  execute(input: string): Promise<void>;
}
