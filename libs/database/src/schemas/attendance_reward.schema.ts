import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type AttendanceRewardDocument = HydratedDocument<AttendanceReward>;

@Schema({ timestamps: true })
export class AttendanceReward extends Document {
  @Prop({ type: Number, index: true, required: true })
  eventId!: number;

  @Prop({ type: String, required: true })
  playerId!: string;

  @Prop({ type: Boolean, required: true })
  received!: boolean;

  @Prop({ type: Object, default: {} })
  metadata!: Record<string, any>;
}

export const AttendanceRewardSchema =
  SchemaFactory.createForClass(AttendanceReward);
