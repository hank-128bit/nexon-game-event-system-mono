import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './role.guard';
import { RoleContext } from '../../module/context/context.type';
import { ContextStore } from '../../module/context/context_store.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthCompositeGuard implements CanActivate {
  constructor(
    private readonly jwtAuthGuard: JwtAuthGuard,
    private readonly rolesGuard: RolesGuard,
    private readonly contextStore: ContextStore<RoleContext>,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const ctx = this.contextStore.getContext();
    const ignoreAuthGuard = this.reflector.get<boolean>(
      'ignoreAuthGuard',
      context.getHandler()
    );
    if (ignoreAuthGuard) {
      return true;
    }

    /** 순서 보장 */
    await this.jwtAuthGuard.canActivate(context);
    await this.rolesGuard.canActivate(context);
    return true;
  }
}
