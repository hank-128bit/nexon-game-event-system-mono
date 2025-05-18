import { SetMetadata } from '@nestjs/common';
import { AdminRole, AdminRoleMap } from '@libs/constants/admin.role';
export const ApiRole = (role: AdminRole): ClassDecorator & MethodDecorator => {
  return (
    target: any,
    key?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>
  ) => {
    if (descriptor && key) {
      // Method decorator
      return SetMetadata('roles', role)(target, key, descriptor);
    }
    // Class decorator
    return SetMetadata('roles', role)(target);
  };
};

export const GuestAPI = (): ClassDecorator & MethodDecorator =>
  ApiRole(AdminRoleMap.NONE);
export const AuditorAPI = (): ClassDecorator & MethodDecorator =>
  ApiRole(AdminRoleMap.AUDITOR);
export const OperatorAPI = (): ClassDecorator & MethodDecorator =>
  ApiRole(AdminRoleMap.OPERATOR);
export const AdminAPI = (): ClassDecorator & MethodDecorator =>
  ApiRole(AdminRoleMap.ADMIN);
