import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import configuration from '../config/configuration';
import { AuthRouterModule } from '../module/router/auth/auth.module';
import { ClientProxyModule } from '../module/proxy/proxy.module';
import { CertificationModule } from '../module/cert/cert.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    /** Certification(JWT) */
    CertificationModule,

    /** Client Proxy for Microservice */
    ClientProxyModule,

    /** Router */
    AuthRouterModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
