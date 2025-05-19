import { Module } from '@nestjs/common';
import { EventRouterController } from './event.controller';
import { EventRouterService } from './event.service';

@Module({
  controllers: [EventRouterController],
  providers: [EventRouterService],
})
export class EventRouterModule {}
