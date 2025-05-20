import { ApiProperty } from '@nestjs/swagger';
import { BaseRequestDTO } from '../base.dto';
import { IsArray, IsNumber } from 'class-validator';
import { Item } from '@libs/database/schemas/item.schema';
import { RewardReceiveType } from '@libs/constants/reward.role';

export class PlayerApplyRequestDto extends BaseRequestDTO {}
export class PlayerApplyResponseDto {
  @ApiProperty({ description: '보상 이벤트' })
  @IsArray()
  events!: EventRewardDto[];
}
export class EventRewardDto {
  @ApiProperty({ description: '자동 보상 이벤트 넘버' })
  @IsNumber()
  eventId!: number;

  @ApiProperty({ description: '이벤트 네임' })
  @IsNumber()
  eventName!: number;

  @ApiProperty({ description: '보상 아이템' })
  @IsArray()
  rewardItems!: Item[];

  @ApiProperty({ description: '지급 방식' })
  @IsNumber()
  rewardReceiveType!: RewardReceiveType;
}
