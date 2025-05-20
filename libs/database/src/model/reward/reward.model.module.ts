import { Module } from '@nestjs/common';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Reward, RewardSchema } from '../../schemas/reward.schema';
import { RewardModelService } from './reward.model.service';
import {
  AutoIncrementID,
  AutoIncrementIDOptions,
} from '@typegoose/auto-increment';
import { Connection } from 'mongoose';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Reward.name,
        useFactory: async (connection: Connection) => {
          const schema = RewardSchema;
          schema.plugin(AutoIncrementID, {
            field: 'rewardId',
            startAt: 1,
          } as AutoIncrementIDOptions);
          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
  ],
  controllers: [],
  providers: [RewardModelService],
  exports: [RewardModelService],
})
export class RewardModelModule {}
