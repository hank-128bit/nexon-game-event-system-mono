import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { AdminRole } from '@libs/constants/index';
import dayjs from 'dayjs';

export type AdminDocument = HydratedDocument<Admin>;

@Schema({ timestamps: true })
export class Admin extends Document {
  @Prop({ type: String, index: true, required: true })
  name!: string;

  @Prop({ type: Number, required: true })
  role!: AdminRole;

  @Prop({ type: Date, default: () => dayjs().toDate() })
  createAt!: Date;

  @Prop({ type: Date, default: () => dayjs().toDate() })
  updateAt!: Date;

  @Prop({ type: Date, default: () => dayjs().toDate() })
  lastAccessAt!: Date;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
