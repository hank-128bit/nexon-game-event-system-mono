import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class BaseRequestDTO {}

export class BaseResponseBodyDTO<T> {
  @IsNotEmpty()
  item!: Array<T> | T;

  @IsNumber()
  status!: number;
}
