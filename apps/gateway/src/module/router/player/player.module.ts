import { Module } from '@nestjs/common';
import { PlayerRouterController } from './player.controller';
import { PlayerRouterService } from './player.service';

@Module({
  controllers: [PlayerRouterController],
  providers: [PlayerRouterService],
})
export class PlayerRouterModule {}
