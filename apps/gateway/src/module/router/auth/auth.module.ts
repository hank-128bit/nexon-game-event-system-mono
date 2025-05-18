import { Module } from '@nestjs/common';
import { AuthRouterController } from './auth.controller';
import { AuthRouterService } from './auth.service';

@Module({
  controllers: [AuthRouterController],
  providers: [AuthRouterService],
})
export class AuthRouterModule {}
