export function isArray(value: unknown, checkLength?: boolean): value is [] {
  if (checkLength) {
    return Array.isArray(value) && value.length > 0;
  }
  return Array.isArray(value);
}
