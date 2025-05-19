import { Module } from '@nestjs/common';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from '../../schemas/event.schema';
import { EventModelService } from './event.model.service';
import {
  AutoIncrementID,
  AutoIncrementIDOptions,
} from '@typegoose/auto-increment';
import { Connection } from 'mongoose';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Event.name,
        useFactory: async (connection: Connection) => {
          const schema = EventSchema;
          schema.plugin(AutoIncrementID, {
            field: 'eventId',
            startAt: 1,
          } as AutoIncrementIDOptions);
          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
  ],
  controllers: [],
  providers: [EventModelService],
  exports: [EventModelService],
})
export class EventModelModule {}
