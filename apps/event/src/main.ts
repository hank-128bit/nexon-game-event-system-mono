import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  /** 마이크로서비스 구성 */
  const port = process.env.PORT;
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: +port,
      },
    }
  );

  await app.listen();
  Logger.log(`🚀 EventServer is running on ${port}`);
}

bootstrap();
