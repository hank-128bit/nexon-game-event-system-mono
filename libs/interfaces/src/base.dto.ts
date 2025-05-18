import { IsNotEmpty, IsOptional } from 'class-validator';

export class BaseRequestDTO {}

class ResponseItem<T> {
  @IsOptional()
  item?: T[] | object;
}

export class BaseResponseBodyDTO<T> {
  @IsNotEmpty()
  items?: ResponseItem<T>;
}
