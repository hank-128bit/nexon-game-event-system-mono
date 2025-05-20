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

export class EventEditRequestDto extends BaseRequestDTO {
  @ApiProperty({ description: '이벤트 넘버' })
  @IsNumber()
  eventId!: number;

  @ApiProperty({ description: '이벤트 제목' })
  @IsOptional()
  @IsString()
  eventName!: string;

  @ApiProperty({ description: '이벤트 시작 시각' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate!: Date;

  @ApiProperty({ description: '이벤트 종료 시각' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate!: Date;

  @ApiProperty({ description: '이벤트 활성화 여부' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: '달성 리워드 지급 방식' })
  @IsOptional()
  @IsNumber()
  rewardReceiveType!: RewardReceiveType;

  @ApiProperty({ description: '이벤트 메타데이터' })
  @IsOptional()
  @IsObject()
  metadata!: Record<string, any>;
}
export class EventEditResponseDto {
  @ApiProperty({ description: '이벤트 넘버' })
  @IsNumber()
  eventId!: number;

  @ApiProperty({ description: '이벤트 제목' })
  @IsString()
  eventName!: string;
}
