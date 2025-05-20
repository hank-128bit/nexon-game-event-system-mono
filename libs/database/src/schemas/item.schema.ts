import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type ItemDocument = HydratedDocument<Item>;

@Schema()
export class Item extends Document {
  @Prop({ type: Number, index: true, unique: true })
  itemId!: number;

  @Prop({ type: String })
  itemType!: string;

  @Prop({ type: String, required: true })
  nameKR!: string;

  @Prop({ type: Number, required: true })
  count!: number;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
