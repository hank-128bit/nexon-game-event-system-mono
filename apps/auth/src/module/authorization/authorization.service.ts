import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { AdminLoginRequestDto } from '@libs/interfaces/auth/admin_login.dto';
import { AdminRegRequestDto } from '@libs/interfaces/auth/admin_registration.dto';
import { AdminRoleMap } from '@libs/constants/admin.role';
import { AdminModelService } from '@libs/database/model/admin/admin.model.service';
import { AuthServiceError } from '../../common/error/auth_service.error';
import { Admin } from '@libs/database/schemas/admin.schema';
import { comparePassword, hashPassword } from '../../common/util/hash/hash';
import { JwtService } from '@nestjs/jwt';
import { ITokenPayload } from '@libs/interfaces/payload/payload.interface';
import { ConfigService } from '@nestjs/config';
import { UpdateRoleRequestDto } from '@libs/interfaces/auth/update_role.dto';
import { PlayerLoginRequestDto } from '@libs/interfaces/auth/player_login.dto';
import { Player } from '@libs/database/schemas/player.schema';
import { PlayerModelService } from '@libs/database/model/player/player.model.service';

@Injectable()
export class AuthorizationService implements OnModuleInit {
  constructor(
    private readonly adminModelService: AdminModelService,
    private readonly playerModelService: PlayerModelService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}
  async onModuleInit() {
    const stage = this.configService.get('stage');
    if (stage === 'local') {
      const adminCount = await this.adminModelService.countDocuments();
      if (adminCount === 0) {
        /** 아이템 더미 세팅 */
        const dummyItems = [
          { email: 'root@nexon.com', password: hashPassword('maplestory') },
        ];
        for (let i = 0; i < dummyItems.length; i++) {
          await this.adminModelService.create(dummyItems[i]);
        }
      }
    }
  }

  async signin(
    param: AdminLoginRequestDto
  ): Promise<Partial<Admin> & { token: string; isNewUser: boolean }> {
    const admin = await this.adminModelService.findByEmail(param.email);
    if (!admin) {
      throw new AuthServiceError(
        '유효하지 않은 이메일입니다.',
        HttpStatus.FORBIDDEN
      );
    }

    const isPasswordValid = await comparePassword(
      param.password,
      admin.password
    );
    if (!isPasswordValid) {
      throw new AuthServiceError(
        '비밀번호를 확인해주세요.',
        HttpStatus.UNAUTHORIZED
      );
    }

    let isNewUser = false;
    if (!admin.accessAt) {
      isNewUser = true;
    }

    const payload: ITokenPayload = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    };
    const token = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('jwtExpiresIn'),
    });

    await this.adminModelService.update(
      { _id: admin._id },
      { $set: { accessAt: new Date() } },
      { upsert: false }
    );

    const adminObject = admin.toObject({ virtuals: true });
    return { isNewUser, token, ...adminObject };
  }

  async signup(param: AdminRegRequestDto): Promise<Admin> {
    const admin = await this.adminModelService.findByEmail(param.email);
    if (admin) {
      throw new AuthServiceError(
        '이미 존재하는 이메일입니다',
        HttpStatus.FORBIDDEN
      );
    }

    const hashedPassword = await hashPassword(param.password);
    const dto: Admin = await this.adminModelService.create({
      email: param.email,
      password: hashedPassword,
      name: param.name,
      role: AdminRoleMap.NONE,
    });
    return dto;
  }

  async updateRole(
    param: ITokenPayload & UpdateRoleRequestDto
  ): Promise<Admin> {
    const target = await this.adminModelService.findByEmail(param.targetEmail);
    if (!target) {
      throw new AuthServiceError(
        '유효하지 않은 이메일입니다.',
        HttpStatus.FORBIDDEN
      );
    }
    /** 최고 관리자만 설정할 수 있도록 가정 (Gateway에서 검증 보장) */
    /** 자신의 권한 이상 계정 업데이트 불가 */
    if (target.role >= param.role) {
      throw new AuthServiceError(
        '상대방의 권한을 업데이트할 수 없습니다.',
        HttpStatus.UNAUTHORIZED
      );
    }

    target.role = param.targetRole;
    const admin = await target.save();
    /** TODO: Audit Log (Kafka) */

    return admin;
  }

  async loginPlayer(
    param: PlayerLoginRequestDto
  ): Promise<Partial<Player> & { token: string }> {
    let player = await this.playerModelService.findByNickname(param.nickname);
    /** 닉네임 계정이 없으면 가입 */
    if (!player) {
      player = await this.playerModelService.create({
        nickname: param.nickname,
        password: await hashPassword(param.password),
        metadata: {
          stage: 0,
          postBox: [],
        },
      });
    }

    const isPasswordValid = await comparePassword(
      param.password,
      player.password
    );
    if (!isPasswordValid) {
      throw new AuthServiceError(
        '비밀번호를 확인해주세요.',
        HttpStatus.UNAUTHORIZED
      );
    }

    const payload: Partial<ITokenPayload> = {
      id: player.id,
      email: '',
      name: player.nickname,
    };
    const token = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('jwtExpiresIn'),
    });

    const playerObject = player.toObject({ virtuals: true });
    return { ...playerObject, token };
  }
}
