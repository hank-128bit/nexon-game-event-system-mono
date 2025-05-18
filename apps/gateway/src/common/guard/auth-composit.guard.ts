import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './role.guard';

@Injectable()
export class AuthCompositeGuard implements CanActivate {
  constructor(
    private readonly jwtAuthGuard: JwtAuthGuard,
    private readonly rolesGuard: RolesGuard
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    /** 순서 보장 */
    const jwtValid = await this.jwtAuthGuard.canActivate(context);
    if (!jwtValid) return false;

    const rolesValid = await this.rolesGuard.canActivate(context);
    return rolesValid;
  }
}
