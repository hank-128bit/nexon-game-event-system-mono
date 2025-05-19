import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  EventAddRequestDto,
  EventAddResponseDto,
} from '@libs/interfaces/event/event_add.dto';
import {
  EventListRequestDto,
  EventListResponseDto,
} from '@libs/interfaces/event/event_list.dto';
import { ITokenPayload } from '@libs/interfaces/payload/payload.interface';

@Injectable()
export class EventRouterService {
  constructor(@Inject('EVENT_SERVICE') private eventClientProxy: ClientProxy) {}

  /**
   * Event 마이크로서비스로 요청 전송 제네릭 함수
   */
  private async sendEventServiceRequest<TParam, TResponse>(
    pattern: string,
    param: TParam
  ): Promise<TResponse> {
    const result = await firstValueFrom(
      this.eventClientProxy.send<TResponse>(pattern, param)
    );
    return result;
  }

  async add(
    payload: ITokenPayload,
    param: EventAddRequestDto
  ): Promise<EventAddResponseDto> {
    param.creator = payload.email;
    return this.sendEventServiceRequest<
      EventAddRequestDto,
      EventAddResponseDto
    >('event.add', param);
  }

  async list(param: EventListRequestDto): Promise<EventListResponseDto> {
    return this.sendEventServiceRequest<
      EventListRequestDto,
      EventListResponseDto
    >('event.list', param);
  }
}
