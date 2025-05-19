import { Body, Controller, Post } from '@nestjs/common';
import { EventRouterService } from './event.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  EventAddRequestDto,
  EventAddResponseDto,
} from '@libs/interfaces/event/event_add.dto';
import {
  AuditorAPI,
  OperatorAPI,
} from '../../../common/decorator/roles.decorator';
import { VerifiedPayload } from '../../../common/decorator/payload.decorator';
import { ITokenPayload } from '@libs/interfaces/payload/payload.interface';
import {
  EventListRequestDto,
  EventListResponseDto,
} from '@libs/interfaces/event/event_list.dto';

@Controller('event')
export class EventRouterController {
  constructor(private readonly eventRouterService: EventRouterService) {}
  @Post('add')
  @ApiOperation({
    summary: '이벤트 생성 API',
    description: '이벤트 생성',
  })
  @ApiBody({ type: EventAddRequestDto })
  @ApiResponse({
    status: 200,
    description: '이벤트 생성 성공',
    type: EventAddResponseDto,
  })
  @OperatorAPI()
  public async add(
    @VerifiedPayload() payload: ITokenPayload,
    @Body() body: EventAddRequestDto
  ): Promise<EventAddResponseDto> {
    const response: EventAddResponseDto = await this.eventRouterService.add(
      payload,
      body
    );

    return response;
  }

  @Post('list')
  @ApiOperation({
    summary: '이벤트 리스트 API',
    description: '이벤트 가져오기(페이지네이션)',
  })
  @ApiBody({ type: EventListRequestDto })
  @ApiResponse({
    status: 200,
    description: '이벤트 가져오기 성공',
    type: EventListResponseDto,
  })
  @AuditorAPI()
  public async list(
    @Body() body: EventListRequestDto
  ): Promise<EventListResponseDto> {
    const response: EventListResponseDto = await this.eventRouterService.list(
      body
    );

    return response;
  }
}
