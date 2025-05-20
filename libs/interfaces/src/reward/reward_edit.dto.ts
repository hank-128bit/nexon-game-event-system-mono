import { ApiProperty } from '@nestjs/swagger';
import { BaseRequestDTO } from '../base.dto';
import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class RewardEditRequestDto extends BaseRequestDTO {
  @ApiProperty({ description: '보상 넘버' })
  @IsNumber()
  rewardId!: number;

  @ApiProperty({ description: '보상 이름' })
  @IsOptional()
  @IsString()
  nameKR?: string;

  @ApiProperty({ description: '보상 아이템 구성' })
  @IsOptional()
  @IsArray()
  itemIds?: number[];

  @ApiProperty({ description: '메타데이터' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
export class RewardEditResponseDto {
  @ApiProperty({ description: '보상 넘버' })
  @IsNumber()
  rewardId!: number;

  @ApiProperty({ description: '보상 이름' })
  @IsString()
  nameKR!: string;
}
