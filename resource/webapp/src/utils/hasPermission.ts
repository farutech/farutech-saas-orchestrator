import type { User } from '@/types'

export function hasPermission(user: User | null | undefined, permission: string): boolean {
  if (!user) return false
  if (!user.permissions || user.permissions.length === 0) return false
  return user.permissions.includes(permission)
}

export function hasAnyPermission(user: User | null | undefined, permissions: string[]): boolean {
  if (!user) return false
  if (!user.permissions || user.permissions.length === 0) return false
  return permissions.some((p) => user.permissions!.includes(p))
}
