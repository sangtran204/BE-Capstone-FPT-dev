// import { Repository } from 'typeorm';
// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { BaseService } from '../base/base.service';

// @Injectable()
// export class FoodsService extends BaseService<FoodEntity> {
//   constructor(
//     @InjectRepository(FoodEntity)
//     private readonly foodsRepository: Repository<FoodEntity>,
//   ) {
//     super(foodsRepository);
//   }

//   async getFood(): Promise<FoodEntity[]> {
//     return await this.foodsRepository.find();
//   }
// }
