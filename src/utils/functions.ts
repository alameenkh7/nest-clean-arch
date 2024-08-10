export function coalesce<T>(value: T | undefined, fallback: T): T {
  return value !== undefined ? value : fallback
}

export const isValidHexColor = (color: string): boolean => {
  const regex = /^#([0-9A-Fa-f]{3}){1,2}$/i
  return regex.test(color)
}
