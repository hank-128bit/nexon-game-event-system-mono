import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  AdminLoginRequestDto,
  AdminLoginResponseDto,
} from '@libs/interfaces/auth/admin_login.dto';
import {
  AdminRegRequestDto,
  AdminRegResponseDto,
} from '@libs/interfaces/auth/admin_registration.dto';
import {
  UpdateRoleRequestDto,
  UpdateRoleResponseDto,
} from '@libs/interfaces/auth/update_role.dto';
import { ITokenPayload } from '@libs/interfaces/payload/payload.interface';

@Injectable()
export class AuthRouterService {
  constructor(@Inject('AUTH_SERVICE') private authClientProxy: ClientProxy) {}

  async adminLogin(
    param: AdminLoginRequestDto
  ): Promise<AdminLoginResponseDto> {
    const pattern = 'adminLogin';
    const result = await firstValueFrom(
      this.authClientProxy.send<AdminLoginResponseDto>(pattern, param)
    );
    return result;
  }

  async adminRegistration(
    param: AdminRegRequestDto
  ): Promise<AdminRegResponseDto> {
    const pattern = 'adminRegistration';
    const result = await firstValueFrom(
      this.authClientProxy.send<AdminRegResponseDto>(pattern, param)
    );
    return result;
  }

  async updateRole(
    param: ITokenPayload & UpdateRoleRequestDto
  ): Promise<UpdateRoleResponseDto> {
    const pattern = 'updateRole';
    const result = await firstValueFrom(
      this.authClientProxy.send<UpdateRoleResponseDto>(pattern, param)
    );
    return result;
  }
}
