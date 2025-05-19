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
import {
  UpdateRoleRequestDto,
  UpdateRoleResponseDto,
} from '@libs/interfaces/auth/update_role.dto';
import { ITokenPayload } from '@libs/interfaces/payload/payload.interface';
import {
  PlayerLoginRequestDto,
  PlayerLoginResponseDto,
} from '@libs/interfaces/auth/player_login.dto';
import { Player } from '@libs/database/schemas/player.schema';

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
  @MessagePattern('updateRole')
  async updateRole(
    param: ITokenPayload & UpdateRoleRequestDto
  ): Promise<UpdateRoleResponseDto> {
    const result: Admin = await this.authService.updateRole(param);
    return {
      targetEmail: result.email,
      targetRole: result.role,
    };
  }
  @MessagePattern('playerLogin')
  async loginPlayer(
    param: PlayerLoginRequestDto
  ): Promise<PlayerLoginResponseDto> {
    const result: Partial<Player> & { token: string } =
      await this.authService.loginPlayer(param);
    return {
      nickname: result.nickname,
      metadata: result.metadata,
      token: result.token,
    };
  }
}
