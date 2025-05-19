import { ApiProperty } from '@nestjs/swagger';
import { BaseRequestDTO } from '../base.dto';
import { IsEmail, IsString } from 'class-validator';

export class AdminRegRequestDto extends BaseRequestDTO {
  @ApiProperty({
    description: '이메일',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: '패스워드',
  })
  @IsString()
  password!: string;

  @ApiProperty({
    description: '이름',
  })
  @IsString()
  name!: string;
}
export class AdminRegResponseDto {
  @ApiProperty({
    description: '이메일',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: '이름',
  })
  @IsString()
  name!: string;
}
