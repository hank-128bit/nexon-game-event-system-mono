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
import {
  PlayerLoginRequestDto,
  PlayerLoginResponseDto,
} from '@libs/interfaces/auth/player_login.dto';

@Injectable()
export class AuthRouterService {
  constructor(@Inject('AUTH_SERVICE') private authClientProxy: ClientProxy) {}

  /**
   * Auth 마이크로서비스로 요청 전송 제네릭 함수
   */
  private async sendAuthServiceRequest<TParam, TResponse>(
    pattern: string,
    param: TParam
  ): Promise<TResponse> {
    const result = await firstValueFrom(
      this.authClientProxy.send<TResponse>(pattern, param)
    );
    return result;
  }

  async adminLogin(
    param: AdminLoginRequestDto
  ): Promise<AdminLoginResponseDto> {
    return this.sendAuthServiceRequest<
      AdminLoginRequestDto,
      AdminLoginResponseDto
    >('adminLogin', param);
  }

  async adminRegistration(
    param: AdminRegRequestDto
  ): Promise<AdminRegResponseDto> {
    return this.sendAuthServiceRequest<AdminRegRequestDto, AdminRegResponseDto>(
      'adminRegistration',
      param
    );
  }

  async updateRole(
    param: ITokenPayload & UpdateRoleRequestDto
  ): Promise<UpdateRoleResponseDto> {
    return this.sendAuthServiceRequest<
      ITokenPayload & UpdateRoleRequestDto,
      UpdateRoleResponseDto
    >('updateRole', param);
  }

  async loginPlayer(
    param: PlayerLoginRequestDto
  ): Promise<PlayerLoginResponseDto> {
    return this.sendAuthServiceRequest<
      PlayerLoginRequestDto,
      PlayerLoginResponseDto
    >('playerLogin', param);
  }
}
