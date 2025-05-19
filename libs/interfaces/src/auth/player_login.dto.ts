import { ApiProperty } from '@nestjs/swagger';
import { BaseRequestDTO } from '../base.dto';
import { IsObject, IsString } from 'class-validator';

export class PlayerLoginRequestDto extends BaseRequestDTO {
  @ApiProperty({
    description: '닉네임',
  })
  @IsString()
  nickname!: string;

  @ApiProperty({
    description: '패스워드',
  })
  @IsString()
  password!: string;
}
export class PlayerLoginResponseDto {
  @ApiProperty({
    description: '닉네임',
  })
  @IsString()
  nickname!: string;

  @ApiProperty({
    description: '플레이어 데이터',
  })
  @IsObject()
  metadata!: Record<string, any>;

  @ApiProperty({
    description: '이벤트 보상 요청 토큰',
  })
  @IsString()
  token!: string;
}
