import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { Item } from './item.schema';

export type RewardDocument = HydratedDocument<Reward>;

@Schema({ timestamps: true })
export class Reward extends Document {
  @Prop({ type: Number, index: true, unique: true })
  rewardId!: number;

  @Prop({ type: String, required: true })
  nameKR!: string;

  @Prop({ type: Array, default: [] })
  items!: Item[];

  @Prop({ type: Array, default: [] })
  usingEventIds!: number[];

  @Prop({ type: Object, default: {} })
  metadata!: Record<string, any>;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
