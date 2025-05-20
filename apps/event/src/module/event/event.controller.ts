import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { EventService } from './event.service';
import {
  EventListRequestDto,
  EventListResponseDto,
} from '@libs/interfaces/event/event_list.dto';
import {
  EventAddRequestDto,
  EventAddResponseDto,
} from '@libs/interfaces/event/event_add.dto';
import {
  EventEditRequestDto,
  EventEditResponseDto,
} from '@libs/interfaces/event/event_edit.dto';

@Controller()
export class EventController {
  constructor(private readonly eventService: EventService) {}
  @MessagePattern('event.list')
  async list(param: EventListRequestDto): Promise<EventListResponseDto> {
    const result = await this.eventService.list(param);
    return result;
  }
  @MessagePattern('event.add')
  async add(param: EventAddRequestDto): Promise<EventAddResponseDto> {
    const result = await this.eventService.add(param);
    return result;
  }

  @MessagePattern('event.edit')
  async edit(param: EventEditRequestDto): Promise<EventEditResponseDto> {
    const result = await this.eventService.edit(param);
    return result;
  }
}
