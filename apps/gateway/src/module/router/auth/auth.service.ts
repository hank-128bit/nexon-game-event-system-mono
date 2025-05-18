import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy, TcpStatus } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  AdminLoginRequestDto,
  AdminLoginResponseDto,
} from '@libs/interfaces/auth/auth.dto';

@Injectable()
export class AuthRouterService implements OnModuleInit {
  constructor(@Inject('AUTH_SERVICE') private authClientProxy: ClientProxy) {}

  async onModuleInit() {
    this.authClientProxy.status.subscribe(async (status: TcpStatus) => {
      console.log('AuthService Instance Status:', status);
      if (status === TcpStatus.DISCONNECTED) {
        // TODO: Alert & Retries
        await this.authClientProxy.connect();
      }
    });
  }

  async adminLogin(
    param: AdminLoginRequestDto
  ): Promise<AdminLoginResponseDto> {
    const pattern = 'admin.login';
    const payload = {
      email: 'hskim@mail.com',
    };
    const result = await firstValueFrom(
      this.authClientProxy.send<AdminLoginResponseDto>(pattern, payload)
    );
    return result;
  }
}
