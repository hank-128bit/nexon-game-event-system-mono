import { Body, Controller, Post } from '@nestjs/common';
import { RewardRouterService } from './reward.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  RewardAddRequestDto,
  RewardAddResponseDto,
} from '@libs/interfaces/reward/reward_add.dto';
import {
  AuditorAPI,
  OperatorAPI,
} from '../../../common/decorator/roles.decorator';
import {
  RewardListRequestDto,
  RewardListResponseDto,
} from '@libs/interfaces/reward/reward_list.dto';
import {
  RewardEditRequestDto,
  RewardEditResponseDto,
} from '@libs/interfaces/reward/reward_edit.dto';

@Controller('reward')
export class RewardRouterController {
  constructor(private readonly rewardRouterService: RewardRouterService) {}
  @Post('add')
  @ApiOperation({
    summary: '보상 생성 API',
    description: '보상 아이템 구성, 메타데이터 설정 등',
  })
  @ApiBody({ type: RewardAddRequestDto })
  @ApiResponse({
    status: 200,
    description: '보상 생성 성공',
    type: RewardAddResponseDto,
  })
  @OperatorAPI()
  public async add(
    @Body() body: RewardAddRequestDto
  ): Promise<RewardAddResponseDto> {
    const response: RewardAddResponseDto = await this.rewardRouterService.add(
      body
    );

    return response;
  }

  @Post('list')
  @ApiOperation({
    summary: '보상 리스트 API',
    description: '이벤트 가져오기(페이지네이션)',
  })
  @ApiBody({ type: RewardListRequestDto })
  @ApiResponse({
    status: 200,
    description: '보상 리스트 가져오기 성공',
    type: RewardListResponseDto,
  })
  @AuditorAPI()
  public async list(
    @Body() body: RewardListRequestDto
  ): Promise<RewardListResponseDto> {
    const response: RewardListResponseDto = await this.rewardRouterService.list(
      body
    );

    return response;
  }

  @Post('edit')
  @ApiOperation({
    summary: '보상 구성 변경 API',
    description: '보상 구성 아이템 변경',
  })
  @ApiBody({ type: RewardEditRequestDto })
  @ApiResponse({
    status: 200,
    description: '보상 구성 변경 성공',
    type: RewardEditResponseDto,
  })
  @AuditorAPI()
  public async edit(
    @Body() body: RewardEditRequestDto
  ): Promise<RewardEditResponseDto> {
    const response: RewardEditResponseDto = await this.rewardRouterService.edit(
      body
    );

    return response;
  }
}
