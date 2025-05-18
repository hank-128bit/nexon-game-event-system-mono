import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { SwaggerBuilder } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;

  SwaggerBuilder.createInstance(app).createSwaggerDocument({
    applicationName: '[🍁MapleStory] Event Service API',
  });

  await app.listen(port);
  Logger.log(
    `🚀 Gateway is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
