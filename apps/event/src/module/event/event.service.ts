import { Injectable } from '@nestjs/common';
import { EventModelService } from '@libs/database/model/event/event.model.service';
import {
  EventAddRequestDto,
  EventAddResponseDto,
} from '@libs/interfaces/event/event_add.dto';
import {
  EventListRequestDto,
  EventListResponseDto,
} from '@libs/interfaces/event/event_list.dto';

@Injectable()
export class EventService {
  constructor(private readonly eventModelService: EventModelService) {}

  async add(param: EventAddRequestDto): Promise<EventAddResponseDto> {
    const event = await this.eventModelService.create(param);

    return {
      eventId: event.eventId,
      eventName: event.eventName,
    };
  }
  async list(param: EventListRequestDto): Promise<EventListResponseDto> {
    const pageSize = 20;
    const skip = param.pageIndex * pageSize;
    const totalCount = await this.eventModelService.countDocuments();

    const items = await this.eventModelService.findAll({}, null, {
      skip,
      limit: pageSize,
      sort: { eventId: -1 },
    });
    return {
      items,
      countPerPage: pageSize,
      hasNextPage: skip + pageSize < totalCount,
      pageIndex: param.pageIndex,
      totalCount,
    };
  }
}
