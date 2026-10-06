import { useState } from "react";

export function useNavigationDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  const open = (): void => {return setIsOpen(true);};

  const close = (): void => {return setIsOpen(false);};

  return { close, isOpen, open };
}
