import { useEffect, useState } from "react";
import type { CommandPaletteState } from "./command-palette-state.interface";

export function useCommandPalette(): CommandPaletteState {
  const [open, setOpen] = useState(false);

  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();

        setOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      return window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const close = (): void => {
    setOpen(false);

    setQuery("");
  };

  const openPalette = (): void => {
    setOpen(true);
  };

  return { close, open, openPalette, query, setQuery };
}
