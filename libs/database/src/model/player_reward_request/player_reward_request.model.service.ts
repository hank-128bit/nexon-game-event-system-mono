import {
  PlayerRewardRequest,
  PlayerRewardRequestDocument,
} from '../../schemas/player_reward_request.schema';
import { BaseModelService } from '../base.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlayerRewardRequestModelService extends BaseModelService<PlayerRewardRequestDocument> {
  constructor(
    @InjectModel(PlayerRewardRequest.name)
    private readonly rewardRequestModel: Model<PlayerRewardRequestDocument>
  ) {
    super(rewardRequestModel);
  }
}
