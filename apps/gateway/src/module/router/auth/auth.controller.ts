import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthRouterService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  AdminLoginRequestDto,
  AdminLoginResponseDto,
  AdminRegRequestDto,
  AdminRegResponseDto,
} from '@libs/interfaces/auth/auth.dto';
import { BaseResponseBodyDTO } from '@libs/interfaces/base.dto';

import { VerifiedPayload } from '../../../common/decorator/payload.decorator';
import { JwtAuthGuard } from '../../../common/guard/jwt-auth.guard';
import { GuestAPI } from '../../../common/decorator/roles.decorator';
import { IVerifiedPayload } from '@libs/interfaces/payload/payload.interface';

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
  })
  @UseGuards(JwtAuthGuard)
  @GuestAPI()
  public async adminLogin(
    @VerifiedPayload() payload: AdminLoginRequestDto
  ): Promise<BaseResponseBodyDTO<AdminLoginResponseDto>> {
    const result: AdminLoginResponseDto =
      await this.authRouterService.adminLogin(payload);

    return {
      data: [result],
      status: 200,
    };
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
  })
  @UseGuards(JwtAuthGuard)
  @GuestAPI()
  public async adminRegistration(
    @Body() body: AdminRegRequestDto
  ): Promise<BaseResponseBodyDTO<AdminRegResponseDto>> {
    const result: AdminRegResponseDto =
      await this.authRouterService.adminRegistration(body);
    return {
      data: [result],
      status: 200,
    };
  }
}
