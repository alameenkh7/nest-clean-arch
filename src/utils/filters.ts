export function isDefined<T>(argument: T | undefined): argument is T {
  return argument !== undefined
}

export function isNotNull<T>(argument: T | null): argument is T {
  return argument !== null
}

export function isNotNullOrUndefined<T>(
  argument: T | null | undefined
): argument is T {
  return argument !== null && argument !== undefined
}

export function isNotEmptyArray<T>(
  argument: T[] | null | undefined
): argument is T[] {
  return argument != null && argument.length > 0
}

export function likeFilter(val: string, like: string): boolean {
  return val.toLocaleLowerCase().includes(like.toLocaleLowerCase())
}
