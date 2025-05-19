import { ApiProperty } from '@nestjs/swagger';
import { BaseRequestDTO } from '../base.dto';
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { RewardReceiveType } from '@libs/constants/reward.role';
import { Type } from 'class-transformer';

export class EventAddRequestDto extends BaseRequestDTO {
  @ApiProperty({ description: '이벤트 제목' })
  @IsString()
  eventName!: string;

  @ApiProperty({ description: '이벤트 시작 시각' })
  @Type(() => Date)
  @IsDate()
  startDate!: Date;

  @ApiProperty({ description: '이벤트 종료 시각' })
  @Type(() => Date)
  @IsDate()
  endDate!: Date;

  @ApiProperty({ description: '이벤트 생성 관리자' })
  @IsString()
  @IsOptional()
  creator?: string;

  @ApiProperty({ description: '이벤트 활성화 여부' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ description: '달성 리워드 지급 방식' })
  @IsNumber()
  rewardReceiveType!: RewardReceiveType;

  @ApiProperty({ description: '이벤트 메타데이터' })
  @IsObject()
  metadata!: Record<string, any>;
}
export class EventAddResponseDto {
  @ApiProperty({ description: '이벤트 넘버' })
  @IsNumber()
  eventId!: number;

  @ApiProperty({ description: '이벤트 제목' })
  @IsString()
  eventName!: string;
}
