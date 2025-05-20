import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  PlayerApplyRequestDto,
  PlayerApplyResponseDto,
} from '@libs/interfaces/player/player_apply.dto';
import { IgnoreAuthGuard } from '../../../common/guard/ignore_guard.decorator';
import { PlayerRouterService } from './player.service';
import { VerifiedPayload } from '../../../common/decorator/payload.decorator';
import { ITokenPayload } from '@libs/interfaces/payload/payload.interface';
import {
  PlayerRewardListRequestDto,
  PlayerRewardListResponseDto,
} from '@libs/interfaces/player/player_reward_list.dto';

@Controller('player')
export class PlayerRouterController {
  constructor(private readonly playerRouterService: PlayerRouterService) {}
  @Post('apply')
  @ApiOperation({
    summary: '보상 요청 API',
    description: '보상 지급 요청',
  })
  @ApiBody({ type: PlayerApplyRequestDto })
  @ApiResponse({
    status: 200,
    description: '보상 지급 성공/대기',
    type: PlayerApplyResponseDto,
  })
  public async apply(
    @VerifiedPayload() payload: ITokenPayload,
    @Body() body: PlayerApplyRequestDto
  ): Promise<PlayerApplyResponseDto> {
    const response: PlayerApplyResponseDto =
      await this.playerRouterService.apply(payload, body);

    return response;
  }
  @Post('rewardList')
  @ApiOperation({
    summary: '보상 지급 내역 API',
    description: '지급된 보상 내역과 지급 대기/거절 보상 내역',
  })
  @ApiBody({ type: PlayerRewardListRequestDto })
  @ApiResponse({
    status: 200,
    description: '보상 내역 리스트',
    type: PlayerRewardListResponseDto,
  })
  public async rewardList(
    @VerifiedPayload() payload: ITokenPayload,
    @Body() body: PlayerRewardListRequestDto
  ): Promise<PlayerRewardListResponseDto> {
    const response: PlayerRewardListResponseDto =
      await this.playerRouterService.rewardList(payload, body);

    return response;
  }
}
