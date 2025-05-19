import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import dayjs from 'dayjs';
import {
  RewardReceiveMap,
  RewardReceiveType,
} from '@libs/constants/reward.role';

export type EventDocument = HydratedDocument<Event>;

@Schema({ timestamps: true })
export class Event extends Document {
  @Prop({ type: Number, index: true, required: true })
  eventId!: number;

  @Prop({ type: String, required: true })
  eventName!: string;

  @Prop({ type: Date, required: true, default: () => dayjs().toDate() })
  startDate!: Date;

  @Prop({ type: Date, required: true, default: () => dayjs().toDate() })
  endDate!: Date;

  @Prop({ type: String, required: true })
  creator!: string;

  @Prop({ type: Boolean, default: false })
  isActive?: boolean;

  @Prop({ type: Number, default: RewardReceiveMap.MANUAL })
  rewardReceiveType?: RewardReceiveType;

  @Prop({ type: Object, default: {} })
  metadata!: Record<string, any>;
}

export const EventSchema = SchemaFactory.createForClass(Event);
