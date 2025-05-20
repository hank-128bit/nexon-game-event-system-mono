import { Module } from '@nestjs/common';
import { RewardController } from './reward.controller';
import { RewardService } from './reward.service';
import { AdminModelModule } from '@libs/database/model/admin/admin.model.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PlayerModelModule } from '@libs/database/model/player/player.model.module';
import { RewardModelModule } from '@libs/database/model/reward/reward.model.module';
import { ItemModelModule } from '@libs/database/model/item/item.model.module';

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
  ],
  controllers: [RewardController],
  providers: [RewardService],
  exports: [RewardService],
})
export class RewardModule {}
