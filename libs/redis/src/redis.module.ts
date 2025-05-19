import { Module, Global, DynamicModule, Provider } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisAsyncOptions, RedisFeatureAsyncOptions, RedisOptions } from './interfaces/redis-options.interface';
import { REDIS_CONNECTION, REDIS_OPTIONS } from './constant';

@Global()
@Module({})
export class RedisModule {
  public static forRootAsync(options: RedisAsyncOptions): DynamicModule {
    const providers = this.createAsyncProviders(options);

    const connectionProvider: Provider = {
      provide: REDIS_CONNECTION,
      useFactory: async (redisOptions: RedisOptions) => {
        if (!redisOptions.url) {
          throw new Error('"url" is not defined');
        }
        return new RedisService(redisOptions as RedisOptions);
      },
      inject: [REDIS_OPTIONS],
    };

    return {
      global: options.isGlobal ?? true,
      module: RedisModule,
      providers: [...providers!, connectionProvider],
      exports: [connectionProvider],
    };
  }

  public static forFeatureAsync(options: RedisFeatureAsyncOptions[]): DynamicModule {
    const optionsProvider: Provider[] = [];
    const connectionProviders: Provider[] = [];

    options.forEach((option) => {
      if (!option.connectionName) {
        throw new Error('"connectionName" for provider is not defined');
      }
      const providers = this.createAsyncProvidersForFeature(option);

      const connectionProvider: Provider = {
        provide: `${REDIS_CONNECTION}_${option.connectionName}`,
        useFactory: async (redisOptions: RedisOptions) => {
          if (!redisOptions.url) {
            throw new Error('"url" is not defined');
          }
          return new RedisService(redisOptions as RedisOptions);
        },
        inject: [`${REDIS_OPTIONS}_${option.connectionName}`],
      };
      optionsProvider.push(providers!);
      connectionProviders.push(connectionProvider);
    });

    return {
      global: true,
      module: RedisModule,
      providers: [...optionsProvider, ...connectionProviders],
      exports: [...connectionProviders],
    };
  }

  private static createAsyncProviders(options: RedisAsyncOptions) {
    if (options.useFactory) {
      return [
        {
          provide: REDIS_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
      ];
    }
  }

  private static createAsyncProvidersForFeature(options: RedisFeatureAsyncOptions) {
    if (options.useFactory) {
      return {
        provide: `${REDIS_OPTIONS}_${options.connectionName}`,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
  }
}
