import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  AdminLoginRequestDto,
  AdminLoginResponseDto,
} from '@libs/interfaces/auth/admin_login.dto';
import {
  AdminRegRequestDto,
  AdminRegResponseDto,
} from '@libs/interfaces/auth/admin_registration.dto';
import { AuthorizationService } from './authorization.service';
import { Admin } from '@libs/database/schemas/admin.schema';

@Controller()
export class AuthorizationController {
  constructor(private readonly authService: AuthorizationService) {}
  @MessagePattern('adminLogin')
  async signin(param: AdminLoginRequestDto): Promise<AdminLoginResponseDto> {
    const result: Partial<Admin> & { isNewUser: boolean; token: string } =
      await this.authService.signin(param);
    return {
      email: result.email,
      name: result.name,
      role: result.role,
      isNewUser: result.isNewUser,
      token: result.token,
    };
  }
  @MessagePattern('adminRegistration')
  async signup(param: AdminRegRequestDto): Promise<AdminRegResponseDto> {
    const result: Admin = await this.authService.signup(param);
    return {
      email: result.email,
      name: result.name,
    };
  }
}
