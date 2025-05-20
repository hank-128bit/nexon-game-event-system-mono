import { Module } from '@nestjs/common';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import {
  PlayerRewardLog,
  PlayerRewardLogSchema,
} from '../../schemas/player_reward_log.schema';
import { PlayerRewardLogModelService } from './player_reward_log.model.service';
import { Connection } from 'mongoose';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: PlayerRewardLog.name,
        useFactory: async (connection: Connection) => {
          const schema = PlayerRewardLogSchema;

          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
  ],
  controllers: [],
  providers: [PlayerRewardLogModelService],
  exports: [PlayerRewardLogModelService],
})
export class PlayerRewardLogModelModule {}
