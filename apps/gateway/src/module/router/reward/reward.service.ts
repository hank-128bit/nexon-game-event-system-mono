import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  RewardAddRequestDto,
  RewardAddResponseDto,
} from '@libs/interfaces/reward/reward_add.dto';
import {
  RewardListRequestDto,
  RewardListResponseDto,
} from '@libs/interfaces/reward/reward_list.dto';

@Injectable()
export class RewardRouterService {
  constructor(@Inject('EVENT_SERVICE') private eventClientProxy: ClientProxy) {}

  /**
   * Reward 마이크로서비스로 요청 전송 제네릭 함수
   */
  private async sendRewardServiceRequest<TParam, TResponse>(
    pattern: string,
    param: TParam
  ): Promise<TResponse> {
    const result = await firstValueFrom(
      this.eventClientProxy.send<TResponse>(pattern, param)
    );
    return result;
  }

  async add(param: RewardAddRequestDto): Promise<RewardAddResponseDto> {
    return this.sendRewardServiceRequest<
      RewardAddRequestDto,
      RewardAddResponseDto
    >('reward.add', param);
  }

  async list(param: RewardListRequestDto): Promise<RewardListResponseDto> {
    return this.sendRewardServiceRequest<
      RewardListRequestDto,
      RewardListResponseDto
    >('reward.list', param);
  }
}
