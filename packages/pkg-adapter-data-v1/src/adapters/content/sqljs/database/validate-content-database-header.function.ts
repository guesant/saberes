export function validateContentDatabaseHeader(bytes: Uint8Array): void {
  const header = "SQLite format 3\0";

  if (
    bytes.length < 100 ||
    !Array.from(header)
      .every((character, index) => {
        return bytes[index] === character.charCodeAt(0);
      })
  ) {
    throw new Error("O arquivo de conteúdo não é um banco SQLite válido.");
  }
}
