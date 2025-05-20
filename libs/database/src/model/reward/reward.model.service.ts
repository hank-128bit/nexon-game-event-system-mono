import { BaseModelService } from '../base.model';
import { Reward, RewardDocument } from '../../schemas/reward.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class RewardModelService extends BaseModelService<RewardDocument> {
  constructor(
    @InjectModel(Reward.name)
    private readonly rewardModel: Model<RewardDocument>
  ) {
    super(rewardModel);
  }
}
