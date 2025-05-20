import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { PlayerModelService } from '@libs/database/model/player/player.model.service';
import _ from 'lodash';
import {
  PlayerApplyRequestDto,
  PlayerApplyResponseDto,
} from '@libs/interfaces/player/player_apply.dto';
import { EventService } from '../event/event.service';
import { EventServiceError } from '../../common/error/event_service.error';
import { RewardReceiveMap } from '@libs/constants/reward.role';
import { PlayerRewardLogModelService } from '@libs/database/model/player_reward_log/player_reward_log.model.service';
import { RewardRequestMap } from '@libs/constants/reward.role';
import { ITokenPayload } from '@libs/interfaces/payload/payload.interface';
import { PlayerRewardRequestModelService } from '@libs/database/model/player_reward_request/player_reward_request.model.service';
@Injectable()
export class PlayerService {
  constructor(
    private readonly playerModelService: PlayerModelService,
    private readonly eventService: EventService,
    private readonly playerRewardLogModelService: PlayerRewardLogModelService,
    private readonly playerRewardRequestModelService: PlayerRewardRequestModelService
  ) {}
  async apply(
    param: PlayerApplyRequestDto & ITokenPayload
  ): Promise<PlayerApplyResponseDto> {
    const session = await this.playerModelService.startSession();
    session.startTransaction();

    try {
      /** 플레이어 검사 */
      const player = await this.playerModelService.findWithId(param.id);
      if (!player) {
        await session.commitTransaction();
        session.endSession();

        throw new EventServiceError(
          '플레이어 정보를 찾을 수 없습니다.',
          HttpStatus.NOT_FOUND
        );
      }
      const playerData = player.metadata;
      /** 진행중인 이벤트 추출 */
      const currentEvents = await this.eventService.getCurrentEvent();
      if (_.isEmpty(currentEvents)) {
        await session.commitTransaction();
        session.endSession();

        return {
          events: [],
        };
      }

      /** 보상 지급 완료된 이벤트 필터링 */
      const alreadyRewardEvent = await this.playerRewardLogModelService.findAll(
        {
          eventId: { $in: currentEvents.map((event) => event.eventId) },
          playerId: player._id,
        }
      );
      /** 이미 보상 받은 이벤트 ID 목록 추출 */
      const receivedEventIds = alreadyRewardEvent.map((log) => log.eventId);
      /** 보상 받지 않은 현재 이벤트 목록 필터링 */
      const pendingEvents = currentEvents.filter(
        (event) => !receivedEventIds.includes(event.eventId)
      );

      const completedEvent = [];
      /** 진행중인 이벤트별 조건 검사 */
      for await (const event of pendingEvents) {
        const conditionChecks = event.metadata.condition.map(
          async (condition) => {
            if (condition.type === 'stage') {
              /** 스테이지 돌파 이벤트 달성 */
              if (playerData.stage >= condition.value) {
                completedEvent.push(event);

                if (event.rewardReceiveType === RewardReceiveMap.MANUAL) {
                  await this.playerRewardRequestModelService.create({
                    eventId: event.eventId,
                    playerId: player.id,
                    status: RewardRequestMap.PENDING,
                    metadata: {},
                  });
                } else if (
                  event.rewardReceiveType === RewardReceiveMap.AUTOMATIC
                ) {
                  /** 자동 지급 방식 */
                  const newPost = {
                    isRead: false,
                    rewardIds: event.metadata.rewardPackageIds,
                  };
                  // $push 연산자로 postBox 배열에 새로운 post 추가
                  await this.playerModelService.update(
                    { _id: player._id },
                    { $push: { 'metadata.postBox': newPost } },
                    { session }
                  );
                  await this.playerRewardLogModelService.create({
                    eventId: event.eventId,
                    playerId: player.id,
                    received: true,
                    metadata: { rewardIds: event.metadata.rewardPackageIds },
                  });
                }
              } else {
                throw new EventServiceError(
                  '이벤트 조건 달성을 하지 못했습니다.',
                  HttpStatus.BAD_REQUEST
                );
              }
            }
          }
        );
        await Promise.all(conditionChecks);
      }

      await session.commitTransaction();
      session.endSession();

      return {
        events: completedEvent.map((event) => {
          return {
            eventId: event.eventId,
            eventName: event.eventName,
            rewardItems: event.metadata.rewardPackageIds,
            rewardReceiveType: event.rewardReceiveType,
          };
        }),
      };
    } catch (error) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      session.endSession();
      throw error;
    }
  }
}
