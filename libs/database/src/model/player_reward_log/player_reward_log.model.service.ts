import { BaseModelService } from '../base.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PlayerRewardLog,
  PlayerRewardLogDocument,
} from '../../schemas/player_reward_log.schema';

@Injectable()
export class PlayerRewardLogModelService extends BaseModelService<PlayerRewardLogDocument> {
  constructor(
    @InjectModel(PlayerRewardLog.name)
    private readonly rewardLogModel: Model<PlayerRewardLogDocument>
  ) {
    super(rewardLogModel);
  }
}
