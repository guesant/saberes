export function addPersonalProgressValue(values: string[], value: string): void {
  if (!values.includes(value)) {
    values.push(value);
  }
}
