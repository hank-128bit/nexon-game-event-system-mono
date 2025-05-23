import {
  Document,
  Model,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
  ClientSession,
  UpdateWithAggregationPipeline,
  MongooseUpdateQueryOptions,
} from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export abstract class BaseModelService<
  T extends Document,
  CreateDto = any,
  UpdateDto = any
> {
  protected constructor(protected readonly model: Model<T>) {}

  async create(createDto: CreateDto): Promise<T> {
    const createdEntity = new this.model(createDto as any);
    return createdEntity.save() as Promise<T>;
  }

  async findAll(
    filter?: FilterQuery<T>,
    projection?: any | null,
    options?: QueryOptions | null
  ): Promise<T[]> {
    return this.model
      .find(filter || ({} as FilterQuery<T>), projection, options)
      .exec() as Promise<T[]>;
  }

  async findOne(
    filter: FilterQuery<T>,
    projection?: any | null,
    options?: QueryOptions | null
  ): Promise<T | null> {
    return this.model
      .findOne(filter, projection, options)
      .exec() as Promise<T | null>;
  }

  async findById(
    id: string | object,
    projection?: any | null,
    options?: QueryOptions | null
  ): Promise<T | null> {
    return this.model
      .findById(id, projection, options)
      .exec() as Promise<T | null>;
  }

  async update(
    id: string | object,
    updateDto: UpdateQuery<UpdateDto>,
    options?: QueryOptions | null
  ): Promise<T | null> {
    const existingEntity = await this.model
      .findByIdAndUpdate(id, updateDto as UpdateQuery<T>, {
        new: true,
        ...options,
      })
      .exec();
    if (!existingEntity) {
      throw new NotFoundException(
        `${this.model.modelName} with id ${id} not found`
      );
    }
    return existingEntity as T;
  }

  async remove(id: string | object): Promise<T | null> {
    const deletedEntity = await this.model.findByIdAndDelete(id).exec();
    if (!deletedEntity) {
      throw new NotFoundException(
        `${this.model.modelName} with id ${id} not found`
      );
    }
    return deletedEntity as T | null;
  }

  async countDocuments(filter?: FilterQuery<T>): Promise<number> {
    return this.model.countDocuments(filter || ({} as FilterQuery<T>)).exec();
  }

  /** Mongoose 세션을 시작합니다. 트랜잭션 처리에 사용됩니다. */
  async startSession(): Promise<ClientSession> {
    return this.model.startSession();
  }

  /** 여러 도큐먼트를 업데이트합니다. 트랜잭션 세션 옵션을 받을 수 있습니다. */
  async updateMany(
    filter: FilterQuery<T>,
    update: UpdateQuery<T> | UpdateWithAggregationPipeline,
    options?: MongooseUpdateQueryOptions
  ): Promise<any> {
    return this.model.updateMany(filter, update, options);
  }
}
