import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { AuthRouterModule } from './module/router/auth/auth.module';
import { ClientProxyModule } from './module/proxy/proxy.module';
import { CertificationModule } from './module/cert/cert.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RolesGuard } from './common/guard/role.guard';
import { RoleInterceptor } from './common/interceptor/role.interceptor';
import { ContextModule } from './module/context/context.module';
import { ContextMiddleware } from './common/middleware/context.middleware';
import { AuthCompositeGuard } from './common/guard/auth-composit.guard';
import { JwtAuthGuard } from './common/guard/jwt-auth.guard';
import { ErrorFilter } from './common/filter/error.filter';
import { RedisModule } from '@libs/redis/redis.module';
import { RedisOptions } from '@libs/redis/interfaces/redis-options.interface';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ContextModule,
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) =>
        configService.get<RedisOptions>('redisConfig')!,
      inject: [ConfigService],
    }),

    /** Certification(JWT) */
    CertificationModule,

    /** Client Proxy for Microservice */
    ClientProxyModule,

    /** Router */
    AuthRouterModule,
  ],
  controllers: [],
  providers: [
    AppService,
    JwtAuthGuard,
    RolesGuard,
    {
      provide: APP_GUARD,
      useClass: AuthCompositeGuard,
    },
    { provide: APP_INTERCEPTOR, useClass: RoleInterceptor },
    { provide: APP_FILTER, useClass: ErrorFilter },
  ],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(ContextMiddleware).forRoutes('*');
  }
}
