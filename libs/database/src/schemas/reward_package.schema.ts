import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type RewardPackageDocument = HydratedDocument<RewardPackage>;

@Schema({ timestamps: true })
export class RewardPackage extends Document {
  @Prop({ type: Number, index: true, required: true })
  packageId!: number;

  @Prop({ type: String, required: true })
  nameKR!: string;

  @Prop({ type: Number, required: true })
  count!: number;

  @Prop({ type: Boolean, default: false })
  isActive!: boolean;

  @Prop({ type: Object, default: {} })
  metadata!: Record<string, any>;
}

export const RewardPackageSchema = SchemaFactory.createForClass(RewardPackage);
