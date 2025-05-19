import { AdminRole } from '@libs/constants/admin.role';

export interface IVerifiedPayload {
  id: string;
  email: string;
  role: AdminRole;
}
