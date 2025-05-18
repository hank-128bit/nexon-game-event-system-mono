import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  AdminLoginRequestDto,
  AdminLoginResponseDto,
} from '@libs/interfaces/auth/auth.dto';

@Injectable()
export class AuthRouterService {
  constructor(@Inject('AUTH_SERVICE') private authClientProxy: ClientProxy) {}

  async adminLogin(
    param: AdminLoginRequestDto
  ): Promise<AdminLoginResponseDto> {
    const pattern = 'adminLogin';
    const result = await firstValueFrom(
      this.authClientProxy.send<AdminLoginResponseDto>(pattern, param)
    );
    return result;
  }
}
