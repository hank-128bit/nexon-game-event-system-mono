import { ApiProperty } from '@nestjs/swagger';
import { BaseRequestDTO } from '../base.dto';
import { IsBoolean, IsEmail, IsEnum, IsString } from 'class-validator';
import { AdminRole, AdminRoleList } from '@libs/constants/admin.role';

export class AdminLoginRequestDto extends BaseRequestDTO {
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
}
export class AdminLoginResponseDto {
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

  @ApiProperty({
    description: '권한 타입',
  })
  @IsEnum(AdminRoleList)
  role!: AdminRole;

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
