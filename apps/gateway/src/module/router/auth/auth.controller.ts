import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthRouterService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  AdminLoginRequestDto,
  AdminLoginResponseDto,
} from '@libs/interfaces/auth/auth.dto';
import { BaseResponseBodyDTO } from '@libs/interfaces/base.dto';
import { JwtAuthGuard } from '../../cert/jwt-auth.guard';
import { VerifiedPayload } from '../../../common/decorator/payload.decorator';

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
  public async adminLogin(
    @VerifiedPayload() payload: AdminLoginRequestDto
  ): Promise<BaseResponseBodyDTO<AdminLoginResponseDto>> {
    const result: AdminLoginResponseDto =
      await this.authRouterService.adminLogin(payload);
    console.log(result);
    return {
      data: [result],
      status: 200,
    };
  }
}
