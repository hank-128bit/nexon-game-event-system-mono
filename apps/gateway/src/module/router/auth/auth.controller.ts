import { Body, Controller, Post } from '@nestjs/common';
import { AuthRouterService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  AdminLoginRequestDto,
  AdminLoginResponseDto,
} from '@libs/interfaces/auth/admin_login.dto';
import {
  AdminRegRequestDto,
  AdminRegResponseDto,
} from '@libs/interfaces/auth/admin_registration.dto';
import { IgnoreAuthGuard } from '../../../common/guard/ignore_guard.decorator';
import { AdminAPI, GuestAPI } from '../../../common/decorator/roles.decorator';
import {
  UpdateRoleRequestDto,
  UpdateRoleResponseDto,
} from '@libs/interfaces/auth/update_role.dto';

@Controller('auth')
export class AuthRouterController {
  constructor(private readonly authRouterService: AuthRouterService) {}
  @Post('admin_login')
  @ApiOperation({
    summary: '관리자 로그인 API',
    description: '인증 토큰 발급',
  })
  @ApiBody({ type: AdminLoginRequestDto })
  @ApiResponse({
    status: 200,
    description: '관리자 로그인 성공',
    type: AdminLoginResponseDto,
  })
  @GuestAPI()
  @IgnoreAuthGuard()
  public async adminLogin(
    @Body() body: AdminLoginRequestDto
  ): Promise<AdminLoginResponseDto> {
    const response: AdminLoginResponseDto =
      await this.authRouterService.adminLogin(body);

    return response;
  }

  @Post('admin_registration')
  @ApiOperation({
    summary: '관리자 가입 API',
    description: '관리자 계정 생성',
  })
  @ApiBody({ type: AdminRegRequestDto })
  @ApiResponse({
    status: 200,
    description: '관리자 가입 성공',
    type: AdminRegResponseDto,
  })
  @GuestAPI()
  @IgnoreAuthGuard()
  public async adminRegistration(
    @Body() body: AdminRegRequestDto
  ): Promise<AdminRegResponseDto> {
    const response: AdminRegResponseDto =
      await this.authRouterService.adminRegistration(body);
    return response;
  }

  @Post('update_role')
  @ApiOperation({
    summary: '권한 업데이트 API',
    description: '권한 설정(마스터 관리자용)',
  })
  @ApiBody({ type: UpdateRoleRequestDto })
  @ApiResponse({
    status: 200,
    description: '권한 설정 성공',
    type: UpdateRoleResponseDto,
  })
  @AdminAPI()
  public async updateRole(
    @Body() body: UpdateRoleRequestDto
  ): Promise<UpdateRoleResponseDto> {
    const response: UpdateRoleResponseDto =
      await this.authRouterService.updateRole(body);
    return response;
  }
}
