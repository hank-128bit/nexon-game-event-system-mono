import { ApiProperty } from '@nestjs/swagger';
import { BaseRequestDTO } from '../base.dto';
import { IsArray, IsBoolean, IsNumber } from 'class-validator';
import { Event } from '@libs/database/schemas/event.schema';

export class EventListRequestDto extends BaseRequestDTO {
  @ApiProperty({
    description: '페이지 인덱스 (0부터 시작)',
  })
  @IsNumber()
  pageIndex!: number;
}
export class EventListResponseDto {
  @ApiProperty({
    description: '이벤트 리스트',
  })
  @IsArray()
  items!: Event[];

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
    description: '총 이벤트 갯수',
  })
  @IsNumber()
  totalCount!: number;
}
