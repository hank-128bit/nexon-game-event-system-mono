import { BaseModelService } from '../base.model';
import { Event, EventDocument } from '../../schemas/event.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class EventModelService extends BaseModelService<EventDocument> {
  constructor(
    @InjectModel(Event.name)
    private readonly eventModel: Model<EventDocument>
  ) {
    super(eventModel);
  }
}
