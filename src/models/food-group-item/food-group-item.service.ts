import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../base/base.service';
import { Injectable } from '@nestjs/common';
import { FoodGroupItemEntity } from './entities/food-group-item.entity';
import { Repository } from 'typeorm';
@Injectable()
export class FoodGroupItemService extends BaseService<FoodGroupItemEntity> {
  constructor(
    @InjectRepository(FoodGroupItemEntity)
    private readonly foodGroupItemEntityRepository: Repository<FoodGroupItemEntity>,
  ) {
    super(foodGroupItemEntityRepository);
  }

  async getFoodGroupItem(): Promise<FoodGroupItemEntity[]> {
    return await this.foodGroupItemEntityRepository.find();
  }
}
