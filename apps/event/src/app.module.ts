import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER } from '@nestjs/core';
import { ErrorFilter } from './common/filter/error.filter';
import { EventModule } from './module/event/event.module';
import { RewardModule } from './module/reward/reward.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: `${config.get<string>('databaseConfig.uri')}`,
        dbName: `${config.get<string>('databaseConfig.database')}`,
        readPreference: 'primary',
        retryWrites: false,
        replicaSet: 'rs0',
        maxPoolSize: 20,
      }),
    }),

    EventModule,
    RewardModule,
  ],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
  ],
})
export class AppModule {}
