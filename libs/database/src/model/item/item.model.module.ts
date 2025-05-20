import { Module } from '@nestjs/common';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Item, ItemSchema } from '../../schemas/item.schema';
import { ItemModelService } from './item.model.service';
import {
  AutoIncrementID,
  AutoIncrementIDOptions,
} from '@typegoose/auto-increment';
import { Connection } from 'mongoose';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Item.name,
        useFactory: async (connection: Connection) => {
          const schema = ItemSchema;
          schema.plugin(AutoIncrementID, {
            field: 'itemId',
            startAt: 1,
          } as AutoIncrementIDOptions);
          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
  ],
  controllers: [],
  providers: [ItemModelService],
  exports: [ItemModelService],
})
export class ItemModelModule {}
