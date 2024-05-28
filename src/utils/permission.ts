import { TPermission } from '@src/types/permission';

/**
 * Check user resource permission
 * @param permissions - Resource permission
 * @param user_permission - User permissions
 * @returns true/false
 */
export function hasPermission(permissions: TPermission[], user_permission: TPermission | TPermission[]) {
  return permissions.filter((v) => user_permission.indexOf(v) !== -1).length >= 1;
}
