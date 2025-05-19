import { AdminRole } from '@libs/constants/admin.role';

export interface ITokenPayload {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
}
