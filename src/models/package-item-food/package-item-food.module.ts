import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodGroupModule } from '../food-group/food-group.module';
import { PackageItemFoodEntity } from './entities/package-item-food.entity';
import { PackageItemFoodController } from './package-item-food.controller';
import { PackageItemFoodService } from './package-item-food.service';

import { PackageItemFoodProfile } from './profile/package-item-food.profile';

@Module({
  imports: [TypeOrmModule.forFeature([PackageItemFoodEntity]), FoodGroupModule],
  controllers: [PackageItemFoodController],
  providers: [PackageItemFoodService, PackageItemFoodProfile],
  exports: [PackageItemFoodService],
})
export class PackageItemFoodModule {}
