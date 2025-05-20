import { Module } from '@nestjs/common';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';

import { PlayerRewardRequestModelService } from './player_reward_request.model.service';
import { Connection } from 'mongoose';
import {
  PlayerRewardRequest,
  PlayerRewardRequestSchema,
} from '../../schemas/player_reward_request.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: PlayerRewardRequest.name,
        useFactory: async (connection: Connection) => {
          const schema = PlayerRewardRequestSchema;

          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
  ],
  controllers: [],
  providers: [PlayerRewardRequestModelService],
  exports: [PlayerRewardRequestModelService],
})
export class PlayerRewardRequestModelModule {}
