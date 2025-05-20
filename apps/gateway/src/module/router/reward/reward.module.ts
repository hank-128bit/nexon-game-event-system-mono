import { Module } from '@nestjs/common';
import { RewardRouterController } from './reward.controller';
import { RewardRouterService } from './reward.service';

@Module({
  controllers: [RewardRouterController],
  providers: [RewardRouterService],
})
export class RewardRouterModule {}
