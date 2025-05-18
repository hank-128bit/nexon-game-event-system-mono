import { ApiProperty } from '@nestjs/swagger';
import { BaseRequestDTO, BaseResponseBodyDTO } from '../base.dto';
import { IsBoolean, IsString } from 'class-validator';

export class AdminLoginRequestDto extends BaseRequestDTO {}

export class AdminLoginResponseDto extends BaseResponseBodyDTO<AdminLoginRequestDto> {
  @ApiProperty({
    description: '계정 ID',
  })
  @IsString()
  id!: string;

  @ApiProperty({
    description: '최초 로그인 플래그',
  })
  @IsBoolean()
  isNewUser!: boolean;

  @ApiProperty({
    description: 'API 토큰',
  })
  @IsString()
  token!: string;
}
