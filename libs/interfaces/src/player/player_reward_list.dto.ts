import { ApiProperty } from '@nestjs/swagger';
import { BaseRequestDTO } from '../base.dto';
import { IsArray } from 'class-validator';
import { PlayerRewardLog } from '@libs/database/schemas/player_reward_log.schema';
import { PlayerRewardRequest } from '@libs/database/schemas/player_reward_request.schema';

export class PlayerRewardListRequestDto extends BaseRequestDTO {}
export class PlayerRewardListResponseDto {
  @ApiProperty({ description: '지급 받은 보상' })
  @IsArray()
  received!: PlayerRewardLog[];

  @ApiProperty({ description: '대기/거절 된 보상' })
  @IsArray()
  delayed!: PlayerRewardRequest[];
}
