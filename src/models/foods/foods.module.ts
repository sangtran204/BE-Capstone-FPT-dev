import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { FoodEntity } from './entities/foods.entity';
import { FoodsController } from './foods.controller';
import { FoodsService } from './foods.service';
import { FoodCategoriesModule } from '../food-categories/food-categories.module';
import { FoodProfile } from './profile/food.profile';
import { ImagesModule } from '../images/images.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FoodEntity]),
    FoodCategoriesModule,
    ImagesModule,
  ],
  controllers: [FoodsController],
  providers: [FoodsService, FoodProfile],
  exports: [FoodsService],
})
export class FoodsModule {}
