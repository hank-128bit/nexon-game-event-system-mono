import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { AdminModelModule } from '@libs/database/model/admin/admin.model.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PlayerModelModule } from '@libs/database/model/player/player.model.module';
import { EventModelModule } from '@libs/database/model/event/event.model.module';
import { RewardModelModule } from '@libs/database/model/reward/reward.model.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwtSecret'),
      }),
      inject: [ConfigService],
    }),
    AdminModelModule,
    PlayerModelModule,
    EventModelModule,
    RewardModelModule,
  ],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
