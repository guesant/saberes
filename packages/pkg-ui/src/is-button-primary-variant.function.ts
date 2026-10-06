export function isButtonPrimaryVariant(variant: string | undefined): boolean {
  if (variant === "contained") {
    return true;
  }

  if (variant === "outlined") {
    return true;
  }

  return false;
}
