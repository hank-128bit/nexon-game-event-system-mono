import { ApiProperty } from '@nestjs/swagger';
import { BaseRequestDTO } from '../base.dto';
import { IsEmail, IsEnum } from 'class-validator';
import { AdminRole, AdminRoleList } from '@libs/constants/admin.role';

export class UpdateRoleRequestDto extends BaseRequestDTO {
  @ApiProperty({
    description: '이메일',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: '타겟 권한 타입',
  })
  @IsEnum(AdminRoleList)
  targeRole!: AdminRole;
}
export class UpdateRoleResponseDto {}
