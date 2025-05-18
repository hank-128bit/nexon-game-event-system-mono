import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export class SwaggerBuilder {
  private readonly logger: Logger = new Logger(SwaggerBuilder.name);
  private readonly app: INestApplication<any>;

  constructor(app: INestApplication) {
    this.app = app;
  }

  public createSwaggerDocument(options: SwaggerBuilderOption) {
    const title = options?.applicationName ?? 'Default';

    const config = new DocumentBuilder()
      .setTitle(title)
      .setDescription(`${title} Swagger`)
      .setVersion(options.applicationVersion ?? '0.0.1')
      .addBearerAuth({ type: 'http', bearerFormat: 'JWT' }, 'authorization')
      .build();

    const document = SwaggerModule.createDocument(this.app, config);
    if (process.env.ENV_NAME === 'local' || process.env.ENV_NAME === 'dev') {
      SwaggerModule.setup('/api/docs', this.app, document);
      this.logger.log(`📃 Swagger document is created at /api/docs`);
    }
  }

  public static createInstance(app: INestApplication) {
    return new SwaggerBuilder(app);
  }
}

interface SwaggerBuilderOption {
  applicationName?: string;
  applicationVersion?: string;
}
