import { HttpStatus, Injectable } from '@nestjs/common';
import { AdminRegRequestDto } from '@libs/interfaces/auth/auth.dto';
import { AdminRoleMap } from '@libs/constants/admin.role';
import { AdminModelService } from '../database/model/admin/admin.model.service';
import { AuthServiceError } from '../../common/error/auth_service.error';

@Injectable()
export class AuthorizationService {
  constructor(private readonly adminModelService: AdminModelService) {}

  async signin() {
    return;
  }

  async signup(param: AdminRegRequestDto) {
    const admin = await this.adminModelService.findByEmail(param.email);
    if (admin) {
      throw new AuthServiceError(
        '이미 존재하는 이메일입니다',
        HttpStatus.FORBIDDEN
      );
    }
    const dto = await this.adminModelService.create({
      email: param.email,
      password: param.password,
      name: param.name,
      role: AdminRoleMap.NONE,
    });
    console.log(dto);
    return dto;
  }
}
