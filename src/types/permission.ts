export const PERMISSIONS = [
  'create-workspace',
  'read-workspace',
  'update-workspace',
  'delete-workspace',
  'create-store',
  'read-store',
  'update-store',
  'delete-store'
] as const;

export type TPermission = (typeof PERMISSIONS)[number];
