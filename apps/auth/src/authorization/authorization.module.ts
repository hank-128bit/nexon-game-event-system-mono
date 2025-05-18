import { Module } from '@nestjs/common';
import { AuthorizationController } from './authorization.controller';

@Module({
  imports: [],
  controllers: [AuthorizationController],
  providers: [],
})
export class AuthorizationModule {}
