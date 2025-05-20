import { ApiProperty } from '@nestjs/swagger';
import { BaseRequestDTO } from '../base.dto';
import { IsArray, IsBoolean, IsNumber } from 'class-validator';
import { Reward } from '@libs/database/schemas/reward.schema';

export class RewardListRequestDto extends BaseRequestDTO {
  @ApiProperty({
    description: '페이지 인덱스 (0부터 시작)',
  })
  @IsNumber()
  pageIndex!: number;
}
export class RewardListResponseDto {
  @ApiProperty({
    description: '리워드 리스트',
  })
  @IsArray()
  items!: Reward[];

  @ApiProperty({
    description: '남은 페이지 여부',
  })
  @IsBoolean()
  hasNextPage!: boolean;

  @ApiProperty({
    description: '페이지 인덱스',
  })
  @IsNumber()
  pageIndex!: number;

  @ApiProperty({
    description: '페이지당 갯수',
  })
  @IsNumber()
  countPerPage!: number;

  @ApiProperty({
    description: '총 리워드 수',
  })
  @IsNumber()
  totalCount!: number;
}
