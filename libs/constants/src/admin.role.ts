export const AdminRoleMap = {
  NONE: 0,
  AUDITOR: 1,
  OPERATOR: 2,
  ADMIN: 999,
} as const;
export const AdminRoleList = Object.values(AdminRoleMap);
export type AdminRole = (typeof AdminRoleList)[number];
