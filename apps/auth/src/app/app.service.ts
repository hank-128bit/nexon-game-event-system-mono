import { Injectable } from '@nestjs/common';
import { AdminRoleMap } from '@libs/constants/index';

@Injectable()
export class AppService {
  getData(): { message: string } {
    const a = AdminRoleMap.ADMIN;
    return { message: `${a}` };
  }
}
