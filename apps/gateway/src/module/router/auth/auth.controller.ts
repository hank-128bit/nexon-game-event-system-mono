import { Body, Controller, Post } from '@nestjs/common';
import { AuthRouterService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  AdminLoginRequestDto,
  AdminLoginResponseDto,
  AdminRegRequestDto,
  AdminRegResponseDto,
} from '@libs/interfaces/auth/auth.dto';
import { GuestAPI } from '../../../common/decorator/roles.decorator';
import { IgnoreAuthGuard } from '../../../common/guard/ignore_guard.decorator';

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
  @IgnoreAuthGuard()
  public async adminRegistration(
    @Body() body: AdminRegRequestDto
  ): Promise<AdminRegResponseDto> {
    const response: AdminRegResponseDto =
      await this.authRouterService.adminRegistration(body);
    return response;
  }
}
