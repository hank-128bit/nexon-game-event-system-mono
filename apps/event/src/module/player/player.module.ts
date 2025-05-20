import { Module } from '@nestjs/common';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { AdminModelModule } from '@libs/database/model/admin/admin.model.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PlayerModelModule } from '@libs/database/model/player/player.model.module';
import { RewardModelModule } from '@libs/database/model/reward/reward.model.module';
import { ItemModelModule } from '@libs/database/model/item/item.model.module';
import { EventModule } from '../event/event.module';
import { PlayerRewardLogModelModule } from '@libs/database/model/player_reward_log/player_reward_log.model.module';
import { PlayerRewardRequestModelModule } from '@libs/database/model/player_reward_request/player_reward_request.model.module';

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
    RewardModelModule,
    ItemModelModule,
    PlayerRewardLogModelModule,
    PlayerRewardRequestModelModule,
    EventModule,
  ],
  controllers: [PlayerController],
  providers: [PlayerService],
  exports: [PlayerService],
})
export class PlayerModule {}
