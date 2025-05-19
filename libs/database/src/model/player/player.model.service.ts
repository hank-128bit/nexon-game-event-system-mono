import { BaseModelService } from '../../model/base.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player, PlayerDocument } from '../../schemas/player.schema';

@Injectable()
export class PlayerModelService extends BaseModelService<PlayerDocument> {
  constructor(
    @InjectModel(Player.name)
    private readonly playerModel: Model<PlayerDocument>
  ) {
    super(playerModel);
  }

  async findByNickname(nickname: string): Promise<PlayerDocument | null> {
    return this.playerModel.findOne({ nickname }).exec();
  }
}
