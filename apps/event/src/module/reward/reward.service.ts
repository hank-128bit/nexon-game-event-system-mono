import { Injectable } from '@nestjs/common';
import { RewardModelService } from '@libs/database/model/reward/reward.model.service';
import {
  RewardAddRequestDto,
  RewardAddResponseDto,
} from '@libs/interfaces/reward/reward_add.dto';
import {
  RewardListRequestDto,
  RewardListResponseDto,
} from '@libs/interfaces/reward/reward_list.dto';

@Injectable()
export class RewardService {
  constructor(private readonly rewardModelService: RewardModelService) {}

  async add(param: RewardAddRequestDto): Promise<RewardAddResponseDto> {
    const reward = await this.rewardModelService.create(param);

    return {
      rewardId: reward.rewardId,
      nameKR: reward.nameKR,
      items: reward.items,
      usingEventIds: reward.usingEventIds,
      metadata: reward.metadata,
    };
  }
  async list(param: RewardListRequestDto): Promise<RewardListResponseDto> {
    const pageSize = 20;
    const skip = param.pageIndex * pageSize;
    const totalCount = await this.rewardModelService.countDocuments();

    const items = await this.rewardModelService.findAll({}, null, {
      skip,
      limit: pageSize,
      sort: { RewardId: -1 },
    });
    return {
      items,
      countPerPage: pageSize,
      hasNextPage: skip + pageSize < totalCount,
      pageIndex: param.pageIndex,
      totalCount,
    };
  }
}
