export const AdminRoleMap = {
  OPERATOR: 1,
  AUDITOR: 2,
  ADMIN: 999,
} as const;
export const AdminRoleList = Object.values(AdminRoleMap);
export type AdminRole = (typeof AdminRoleList)[number];
