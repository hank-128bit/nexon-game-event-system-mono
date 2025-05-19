import { Module } from '@nestjs/common';
import { PlayerModelService } from './player.model.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Player, PlayerSchema } from '../../schemas/player.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Player.name, schema: PlayerSchema }]),
  ],
  controllers: [],
  providers: [PlayerModelService],
  exports: [PlayerModelService],
})
export class PlayerModelModule {}
