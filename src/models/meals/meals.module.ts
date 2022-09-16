import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { MealEntity } from './entities/meal.entity';
import { MealsController } from './meals.controller';
import { MealsService } from './meals.service';
import { MealProfile } from './profile/meal.profile';
import { TimeSlotsModule } from '../timeSlots/timeSlots.module';

@Module({
  imports: [TypeOrmModule.forFeature([MealEntity]), TimeSlotsModule],
  controllers: [MealsController],
  providers: [MealsService, MealProfile],
  exports: [MealsService],
})
export class MealModule {}
