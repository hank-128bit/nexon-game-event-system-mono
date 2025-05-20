import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PlayerService } from './player.service';
import {
  PlayerApplyRequestDto,
  PlayerApplyResponseDto,
} from '@libs/interfaces/player/player_apply.dto';
import { ITokenPayload } from '@libs/interfaces/payload/payload.interface';
@Controller()
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}
  @MessagePattern('player.apply')
  async apply(
    param: PlayerApplyRequestDto & ITokenPayload
  ): Promise<PlayerApplyResponseDto> {
    const result = await this.playerService.apply(param);
    return result;
  }
}
