import { INestMicroservice, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import {
  MicroserviceOptions,
  TcpStatus,
  Transport,
} from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;

  await app.listen(port);
  Logger.log(
    `🚀 Gateway is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
