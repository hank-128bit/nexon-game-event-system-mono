import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  AdminLoginRequestDto,
  AdminLoginResponseDto,
} from '@libs/interfaces/auth/auth.dto';

@Controller()
export class AuthorizationController {
  @MessagePattern('adminLogin')
  async signin(param: AdminLoginRequestDto): Promise<AdminLoginResponseDto> {
    console.log(param);
    const result: AdminLoginResponseDto = {
      id: '',
      isNewUser: false,
      token: '',
    };
    return result;
  }
}
