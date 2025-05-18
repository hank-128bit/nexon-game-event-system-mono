import { AdminRole } from '@libs/constants/admin.role';

export interface RoleContext {
  admin: {
    id: string;
    role: AdminRole;
  };
  isAvailable: boolean;
  apiRole: AdminRole;
}
