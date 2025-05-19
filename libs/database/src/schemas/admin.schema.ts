import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { AdminRole } from '@libs/constants/index';
import dayjs from 'dayjs';

export type AdminDocument = HydratedDocument<Admin>;

@Schema({ timestamps: true })
export class Admin extends Document {
  @Prop({ type: String, index: true, required: true })
  email!: string;

  @Prop({ type: String, required: true })
  password!: string;

  @Prop({ type: String, required: true })
  name!: string;

  @Prop({ type: Number, required: true })
  role!: AdminRole;

  @Prop({ type: Date, default: null })
  accessAt!: Date;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
