import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { EventModelService } from '@libs/database/model/event/event.model.service';
import {
  EventAddRequestDto,
  EventAddResponseDto,
} from '@libs/interfaces/event/event_add.dto';
import {
  EventListRequestDto,
  EventListResponseDto,
} from '@libs/interfaces/event/event_list.dto';
import {
  EventEditRequestDto,
  EventEditResponseDto,
} from '@libs/interfaces/event/event_edit.dto';
import _ from 'lodash';
import { EventServiceError } from '../../common/error/event_service.error';
import { RewardModelService } from '@libs/database/model/reward/reward.model.service';
import { ConfigService } from '@nestjs/config';
import { RewardReceiveMap } from '@libs/constants/reward.role';
import { Event } from '@libs/database/schemas/event.schema';
import dayjs from 'dayjs';

@Injectable()
export class EventService implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    private readonly eventModelService: EventModelService,
    private readonly rewardModelService: RewardModelService
  ) {}

  async onModuleInit() {
    const stage = this.configService.get('stage');
    if (stage === 'local') {
      const count = await this.eventModelService.countDocuments();
      if (count === 0) {
        /** 아이템 더미 세팅 */
        const dummyItems = [
          {
            eventName: '스테이지999 클리어 이벤트!',
            startDate: '2025-05-19T00:00:00.118Z',
            endDate: '2025-06-01T00:00:00.118Z',
            isActive: true,
            rewardReceiveType: RewardReceiveMap.AUTOMATIC,
            creator: 'root@maplestory.com',
            metadata: {
              condition: [{ type: 'stage', value: '999' }],
              rewardPackageIds: [1],
            },
          },
        ];
        for (let i = 0; i < dummyItems.length; i++) {
          await this.eventModelService.create(dummyItems[i]);
        }
      }
    }
  }

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
  async edit(param: EventEditRequestDto): Promise<EventEditResponseDto> {
    const session = await this.eventModelService.startSession();
    session.startTransaction();

    try {
      let event = await this.eventModelService.findOne(
        { eventId: param.eventId },
        null,
        { session }
      );
      if (!event) {
        throw new EventServiceError(
          '이벤트가 존재하지 않습니다.',
          HttpStatus.NOT_FOUND
        );
      }

      const oldRewardIds: number[] = event.metadata?.rewardPackageIds || [];
      const newRewardIds: number[] = param.metadata?.rewardPackageIds || [];

      /** 이벤트와 보상이 양방향 참조되고 있으므로 비교 후, 트랜잭셔널 업데이트 진행 */
      if (!_.isEqual(oldRewardIds, newRewardIds)) {
        const rewardIdsToRemoveEventId = oldRewardIds.filter(
          (id) => !newRewardIds.includes(id)
        );
        const rewardIdsToAddEventId = newRewardIds.filter(
          (id) => !oldRewardIds.includes(id)
        );

        if (rewardIdsToRemoveEventId.length > 0) {
          await this.rewardModelService.updateMany(
            { rewardId: { $in: rewardIdsToRemoveEventId } },
            { $pull: { usingEventIds: event.eventId } },
            { session }
          );
        }

        if (rewardIdsToAddEventId.length > 0) {
          await this.rewardModelService.updateMany(
            { rewardId: { $in: rewardIdsToAddEventId } },
            { $addToSet: { usingEventIds: event.eventId } },
            { session }
          );
        }
      }

      event = await this.eventModelService.update(
        { _id: event._id },
        {
          $set: _.omit(param, ['eventId', '_id', '__v']),
        },
        { session, upsert: false }
      );

      await session.commitTransaction();
      session.endSession();

      return {
        eventId: event.eventId,
        eventName: event.eventName,
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
  async getCurrentEvent(): Promise<Event[]> {
    const now = dayjs().toDate();
    const currentEvents = await this.eventModelService.findAll({
      startDate: { $lte: now },
      endDate: { $gte: now },
      isActive: true,
    });

    return currentEvents;
  }
}
