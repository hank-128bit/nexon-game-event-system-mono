import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  AdminLoginRequestDto,
  AdminLoginResponseDto,
  AdminRegRequestDto,
  AdminRegResponseDto,
} from '@libs/interfaces/auth/auth.dto';
import { AuthorizationService } from './authorization.service';

@Controller()
export class AuthorizationController {
  constructor(private readonly authService: AuthorizationService) {}
  @MessagePattern('adminLogin')
  async signin(param: AdminLoginRequestDto): Promise<AdminLoginResponseDto> {
    console.log(param);
    const result: AdminLoginResponseDto = null;
    return result;
  }
  @MessagePattern('adminRegistration')
  async signup(param: AdminRegRequestDto): Promise<AdminRegResponseDto> {
    console.log(param);
    await this.authService.signup(param);
    const result: AdminRegResponseDto = null;
    return result;
  }
}
