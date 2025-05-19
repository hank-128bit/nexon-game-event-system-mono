import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class BaseRequestDTO {}
export class BaseResponseBodyDTO<T> {
  @IsNotEmpty()
  @ApiProperty({
    description: '응답 데이터',
  })
  data!: Array<T> | T;

  @IsNumber()
  @ApiProperty({
    description: '응답 상태 코드',
  })
  status!: number;
}
