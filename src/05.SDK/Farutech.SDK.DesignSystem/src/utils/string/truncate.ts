/**
 * Truncates a string to a specified length with an optional suffix
 * @param str - The string to truncate
 * @param maxLength - Maximum length of the truncated string
 * @param suffix - Suffix to append when truncated (default: '...')
 * @returns The truncated string
 */
export function truncate(str: string, maxLength: number, suffix: string = '...'): string {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}