import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { FoodGroupItemEntity } from './entities/food-group-item.entity';
import { FoodsModule } from '../foods/foods.module';
import { FoodGroupItemController } from './food-group-item.controller';
import { FoodGroupItemService } from './food-group-item.service';
import { FoodGroupItemProfile } from './profile/food-group-item.profile';
import { FoodGroupModule } from '../food-group/food-group.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FoodGroupItemEntity]),
    FoodsModule,
    FoodGroupModule,
  ],
  controllers: [FoodGroupItemController],
  providers: [FoodGroupItemService, FoodGroupItemProfile],
  exports: [FoodGroupItemService],
})
export class FoodGroupItemModule {}
