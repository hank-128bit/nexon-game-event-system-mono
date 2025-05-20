import { BaseModelService } from '../base.model';
import { Item, ItemDocument } from '../../schemas/item.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ItemModelService extends BaseModelService<ItemDocument> {
  constructor(
    @InjectModel(Item.name)
    private readonly itemModel: Model<ItemDocument>
  ) {
    super(itemModel);
  }
}
