import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy, TcpStatus } from '@nestjs/microservices';
import { GatewayLogger } from './common/logger/logger';

@Injectable()
export class AppService implements OnModuleInit {
  private logger: GatewayLogger = new GatewayLogger(`${AppService.name}`);
  constructor(
    @Inject('AUTH_SERVICE') private authClientProxy: ClientProxy,
    @Inject('EVENT_SERVICE') private eventClientProxy: ClientProxy
  ) {}

  async onModuleInit() {
    this.authClientProxy.status.subscribe(async (status: TcpStatus) => {
      this.logger.log(`AuthService Instance Status: ${status}`);
      if (status === 'disconnected') {
        // TODO: Alert & Retries
        this.logger.error(`AuthService Instance Status: ${status}`);
        await this.authClientProxy.connect();
      }
    });
    this.eventClientProxy.status.subscribe(async (status: TcpStatus) => {
      this.logger.log(`EventService Instance Status: ${status}`);
      if (status === 'disconnected') {
        // TODO: Alert & Retries
        this.logger.error(`EventService Instance Status: ${status}`);
        await this.eventClientProxy.connect();
      }
    });
  }
}
