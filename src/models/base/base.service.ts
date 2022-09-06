import { HttpException, HttpStatus } from '@nestjs/common';
import {
  DataSource,
  DeepPartial,
  DeleteResult,
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from 'typeorm';
import { EntityId } from 'typeorm/repository/EntityId';
import { BaseEntity } from './base.entity';
export class BaseService<T extends BaseEntity> {
  constructor(private readonly repository: Repository<T>) {}

  create(entity: DeepPartial<T>): T {
    return this.repository.create(entity);
  }

  async save(entity: DeepPartial<T>): Promise<T> {
    return this.repository.save(entity);
  }

  async query(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  async findOne(options: FindOneOptions<T>): Promise<T> {
    return this.repository.findOne(options);
  }

  async transaction(
    callback: (entityManager: EntityManager) => Promise<void>,
    dataSource: DataSource,
  ): Promise<void> {
    const queryRunner = dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await callback(queryRunner.manager);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(error);
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }
}
