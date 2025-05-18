import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ContextStore } from '../../module/context/context_store.service';
import { RoleContext } from '../../module/context/context.type';
import { AdminRole, AdminRoleMap } from '@libs/constants/admin.role';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly contextStore: ContextStore<RoleContext>,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const ctx = this.contextStore.getContext();
    const { user } = request;
    if (!user) {
      ctx.set('isAvailable', false);
      return true;
    }
    /** API 요청 가능 여부를 검증한 후 컨텍스트에 저장 -> RoleInterceptor 에서 롤 기반 API 최종 처리 */
    const validated = this.validateRoles(
      user?.admin?.role ?? AdminRoleMap.NONE,
      context
    );
    ctx.set('isAvailable', validated);

    return true;
  }

  private validateRoles(
    requesterRole: AdminRole,
    context: ExecutionContext
  ): boolean {
    const handlerRole = this.reflector.get<AdminRole>(
      'roles',
      context.getHandler()
    );
    const classRole = this.reflector.get<AdminRole>(
      'roles',
      context.getClass()
    );
    const apiRole: AdminRole = handlerRole ?? classRole ?? AdminRoleMap.NONE;

    const ctx = this.contextStore.getContext();
    ctx.set('apiRole', apiRole);

    if (requesterRole === AdminRoleMap.ADMIN) {
      return true;
    }

    /** Role 상수 정의 시, 상위 권한을 높게 할당하는 규칙을 위반하지 않으면 아래 단순 비교 로직으로 권한 체크 가능 */
    return requesterRole >= (apiRole ?? AdminRoleMap.NONE);
  }
}
