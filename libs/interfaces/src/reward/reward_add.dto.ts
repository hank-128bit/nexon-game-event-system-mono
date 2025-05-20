import { ApiProperty } from '@nestjs/swagger';
import { BaseRequestDTO } from '../base.dto';
import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Item } from '@libs/database/schemas/item.schema';

export class RewardAddRequestDto extends BaseRequestDTO {
  @ApiProperty({ description: '보상 이름' })
  @IsString()
  nameKR!: string;

  @ApiProperty({ description: '보상 아이템 구성' })
  @IsArray()
  items!: Item[];

  @ApiProperty({ description: '메타데이터' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
export class RewardAddResponseDto {
  @ApiProperty({ description: '보상 넘버' })
  @IsNumber()
  rewardId!: number;

  @ApiProperty({ description: '보상 이름' })
  @IsString()
  nameKR!: string;

  @ApiProperty({ description: '보상 아이템 구성' })
  @IsArray()
  items!: Item[];

  @ApiProperty({ description: '사용중인 이벤트' })
  @IsArray()
  usingEventIds!: number[];

  @ApiProperty({ description: '메타데이터' })
  @IsObject()
  metadata!: Record<string, any>;
}
