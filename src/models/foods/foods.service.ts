import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../base/base.service';
import { FoodEntity } from './entities/foods.entity';
import { IsActiveEnum } from 'src/common/enums/isActive.enum';

@Injectable()
export class FoodsService extends BaseService<FoodEntity> {
  constructor(
    @InjectRepository(FoodEntity)
    private readonly foodsRepository: Repository<FoodEntity>,
  ) {
    super(foodsRepository);
  }

  async getAllFood(): Promise<FoodEntity[]> {
    return await this.foodsRepository.find();
  }

  async getAllActiveFood(): Promise<FoodEntity[]> {
    return await this.foodsRepository.find({
      where: { isActive: IsActiveEnum.ACTIVE },
    });
  }
}
