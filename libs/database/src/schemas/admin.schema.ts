import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { AdminRole, AdminRoleMap } from '@libs/constants/index';

export type AdminDocument = HydratedDocument<Admin>;

@Schema({ timestamps: true })
export class Admin extends Document {
  @Prop({ type: String, index: true, required: true })
  email!: string;

  @Prop({ type: String, required: true })
  password!: string;

  @Prop({ type: String, required: true })
  name!: string;

  @Prop({ type: Number, required: true, default: AdminRoleMap.NONE })
  role!: AdminRole;

  @Prop({ type: Date, default: null })
  accessAt!: Date;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
