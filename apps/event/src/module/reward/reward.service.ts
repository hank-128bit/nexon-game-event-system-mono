import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { RewardModelService } from '@libs/database/model/reward/reward.model.service';
import {
  RewardAddRequestDto,
  RewardAddResponseDto,
} from '@libs/interfaces/reward/reward_add.dto';
import {
  RewardListRequestDto,
  RewardListResponseDto,
} from '@libs/interfaces/reward/reward_list.dto';
import { ItemModelService } from '@libs/database/model/item/item.model.service';
import {
  RewardEditRequestDto,
  RewardEditResponseDto,
} from '@libs/interfaces/reward/reward_edit.dto';
import { EventServiceError } from '../../common/error/event_service.error';
import _ from 'lodash';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RewardService implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    private readonly rewardModelService: RewardModelService,
    private readonly itemModelService: ItemModelService
  ) {}

  async onModuleInit() {
    const stage = this.configService.get('stage');
    if (stage === 'local') {
      const itemCount = await this.itemModelService.countDocuments();
      if (itemCount === 0) {
        /** 아이템 더미 세팅 */
        const dummyItems = [
          { itemType: 'GOODS', nameKR: '보석 100개 주머니', count: 100 },
          { itemType: 'GOODS', nameKR: '보석 300개 주머니', count: 300 },
          { itemType: 'GOODS', nameKR: '보석 1000개 주머니', count: 1000 },
          { itemType: 'EXP', nameKR: '경험치 1000', count: 1000 },
          { itemType: 'EXP', nameKR: '경험치 3000', count: 3000 },
          { itemType: 'TICKET', nameKR: '커닝시티 지하철 입장권', count: 1 },
        ];
        for (let i = 0; i < dummyItems.length; i++) {
          await this.itemModelService.create(dummyItems[i]);
        }
      }
      const rewardCount = await this.rewardModelService.countDocuments();
      if (rewardCount === 0) {
        /** 아이템 더미 세팅 */
        const dummyItems = [
          {
            nameKR: '스테이지999 돌파 보상!',
            itemIds: [1],
            usingEventIds: [1],
            metadata: {},
          },
        ];
        for (let i = 0; i < dummyItems.length; i++) {
          await this.rewardModelService.create(dummyItems[i]);
        }
      }
    }
  }
  async add(param: RewardAddRequestDto): Promise<RewardAddResponseDto> {
    const reward = await this.rewardModelService.create(param);

    return {
      rewardId: reward.rewardId,
      nameKR: reward.nameKR,
      itemIds: [],
      usingEventIds: [],
      metadata: reward.metadata,
    };
  }
  async list(param: RewardListRequestDto): Promise<RewardListResponseDto> {
    const pageSize = 20;
    const skip = param.pageIndex * pageSize;
    const totalCount = await this.rewardModelService.countDocuments();

    const items = await this.rewardModelService.findAll({}, null, {
      skip,
      limit: pageSize,
      sort: { RewardId: -1 },
    });
    return {
      items,
      countPerPage: pageSize,
      hasNextPage: skip + pageSize < totalCount,
      pageIndex: param.pageIndex,
      totalCount,
    };
  }
  async edit(param: RewardEditRequestDto): Promise<RewardEditResponseDto> {
    const session = await this.rewardModelService.startSession();
    session.startTransaction();

    try {
      let reward = await this.rewardModelService.findOne(
        { rewardId: param.rewardId },
        null,
        { session }
      );
      if (!reward) {
        throw new EventServiceError(
          '보상 패키지가 존재하지 않습니다.',
          HttpStatus.NOT_FOUND
        );
      }

      if (param?.itemIds) {
        const itemCount = param.itemIds.length;
        if (itemCount > 0) {
          const items = await this.itemModelService.findAll({
            itemId: { $in: param.itemIds },
          });

          if (
            !_.isEqual(
              param.itemIds,
              items.map((item) => item.itemId)
            )
          ) {
            throw new EventServiceError(
              '존재하지 않는 아이템이 있으므로 보상 업데이트가 실패했습니다.',
              HttpStatus.NOT_FOUND
            );
          }
        }
      }

      reward = await this.rewardModelService.update(
        { _id: reward._id },
        {
          $set: _.omit(param, ['rewardId', '_id', '__v']),
        },
        { session, upsert: false }
      );

      await session.commitTransaction();
      session.endSession();

      return {
        rewardId: reward.rewardId,
        nameKR: reward.nameKR,
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}
