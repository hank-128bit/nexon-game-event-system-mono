import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy, TcpStatus } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(@Inject('AUTH_SERVICE') private authClientProxy: ClientProxy) {}

  async onModuleInit() {
    this.authClientProxy.status.subscribe((status: TcpStatus) => {
      console.log('AuthService Instance Status:', status);
    });
  }

  async getData(): Promise<string> {
    // await this.client.connect();
    const pattern = 'signin';
    const payload = {
      email: 'hskim@mail.com',
    };
    const result = await firstValueFrom(
      this.authClientProxy.send<{ token: string }>(pattern, payload)
    );
    console.log('result', result);
    return 'success';
  }
}
