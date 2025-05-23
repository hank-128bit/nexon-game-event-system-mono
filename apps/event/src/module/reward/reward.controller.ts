import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RewardService } from './reward.service';
import {
  RewardListRequestDto,
  RewardListResponseDto,
} from '@libs/interfaces/reward/reward_list.dto';
import {
  RewardAddRequestDto,
  RewardAddResponseDto,
} from '@libs/interfaces/reward/reward_add.dto';
import {
  RewardEditRequestDto,
  RewardEditResponseDto,
} from '@libs/interfaces/reward/reward_edit.dto';

@Controller()
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}
  @MessagePattern('reward.list')
  async list(param: RewardListRequestDto): Promise<RewardListResponseDto> {
    const result = await this.rewardService.list(param);
    return result;
  }
  @MessagePattern('reward.add')
  async add(param: RewardAddRequestDto): Promise<RewardAddResponseDto> {
    const result = await this.rewardService.add(param);
    return result;
  }
  @MessagePattern('reward.edit')
  async edit(param: RewardEditRequestDto): Promise<RewardEditResponseDto> {
    const result = await this.rewardService.edit(param);
    return result;
  }
}
