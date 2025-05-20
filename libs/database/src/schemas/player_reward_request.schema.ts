import {
  RewardRequestMap,
  RewardRequestType,
} from '@libs/constants/reward.role';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type PlayerRewardRequestDocument = HydratedDocument<PlayerRewardRequest>;

@Schema({ timestamps: true })
export class PlayerRewardRequest extends Document {
  @Prop({ type: String, index: true, required: true })
  playerId!: string;

  @Prop({ type: Number, required: true })
  eventId!: number;

  @Prop({ type: Number, required: true, default: RewardRequestMap.PENDING })
  status!: RewardRequestType;

  @Prop({ type: Object, default: {} })
  metadata!: Record<string, any>;
}

export const PlayerRewardRequestSchema =
  SchemaFactory.createForClass(PlayerRewardRequest);
