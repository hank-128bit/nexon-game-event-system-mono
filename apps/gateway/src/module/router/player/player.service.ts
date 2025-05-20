import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  PlayerApplyRequestDto,
  PlayerApplyResponseDto,
} from '@libs/interfaces/player/player_apply.dto';
import { ITokenPayload } from '@libs/interfaces/payload/payload.interface';

@Injectable()
export class PlayerRouterService {
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

  async apply(
    payload: ITokenPayload,
    param: PlayerApplyRequestDto
  ): Promise<PlayerApplyResponseDto> {
    return this.sendRewardServiceRequest<
      PlayerApplyRequestDto,
      PlayerApplyResponseDto
    >('player.apply', { ...param, ...payload });
  }
}
