import { ApiProperty } from '@nestjs/swagger';
import { BaseRequestDTO } from '../base.dto';
import { IsEmail, IsEnum } from 'class-validator';
import { AdminRole, AdminRoleList } from '@libs/constants/admin.role';

export class UpdateRoleRequestDto extends BaseRequestDTO {
  @ApiProperty({
    description: '이메일',
  })
  @IsEmail()
  targetEmail!: string;

  @ApiProperty({
    description: '타겟 권한 타입',
  })
  @IsEnum(AdminRoleList)
  targetRole!: AdminRole;
}
export class UpdateRoleResponseDto {
  @ApiProperty({
    description: '이메일',
  })
  @IsEmail()
  targetEmail!: string;

  @ApiProperty({
    description: '업데이트 후 권한 타입',
  })
  @IsEnum(AdminRoleList)
  targetRole!: AdminRole;
}
