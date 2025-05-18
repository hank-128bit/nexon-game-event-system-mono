import { Body, Controller, Post } from '@nestjs/common';
import { AuthRouterService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  AdminLoginRequestDto,
  AdminLoginResponseDto,
} from '@libs/interfaces/auth/auth.dto';
import { BaseResponseBodyDTO } from '@libs/interfaces/base.dto';

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
  public async adminLogin(
    @Body() body: AdminLoginRequestDto
  ): Promise<BaseResponseBodyDTO<AdminLoginResponseDto>> {
    const result: AdminLoginResponseDto =
      await this.authRouterService.adminLogin(body);
    console.log(result);
    return {
      data: [result],
      status: 200,
    };
  }
}
