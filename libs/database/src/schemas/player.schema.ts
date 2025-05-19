import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type PlayerDocument = HydratedDocument<Player>;

@Schema({ timestamps: true })
export class Player extends Document {
  @Prop({ type: String, index: true, required: true, unique: true })
  nickname!: string;

  @Prop({ type: String, required: true })
  password!: string;

  @Prop({ type: Object, default: {} })
  metadata!: Record<string, any>;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
