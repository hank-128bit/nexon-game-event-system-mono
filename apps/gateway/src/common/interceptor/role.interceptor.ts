import { CallHandler, UnauthorizedException } from '@nestjs/common';
import { Injectable, NestInterceptor } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ContextStore } from '../../module/context/context_store.service';
import { RoleContext } from '../../module/context/context.type';

@Injectable()
export class RoleInterceptor implements NestInterceptor {
  constructor(private readonly contextStore: ContextStore<RoleContext>) {}

  public async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const ctx = this.contextStore.getContext();

    const isAvailable = ctx.get('isAvailable');
    const allowedApi = ['/api/auth/admin_login'];

    if (!allowedApi.includes(request.path) && !isAvailable) {
      throw new UnauthorizedException();
    }

    return next.handle();
  }
}
