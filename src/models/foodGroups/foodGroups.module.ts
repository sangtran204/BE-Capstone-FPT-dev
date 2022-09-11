import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { FoodGroupEntity } from './entities/foodGroups.entity';
import { FoodGroupController } from './foodGroups.controller';
import { FoodGroupService } from './foodGroups.service';

@Module({
  imports: [TypeOrmModule.forFeature([FoodGroupEntity])],
  controllers: [FoodGroupController],
  providers: [FoodGroupService],
  exports: [FoodGroupService],
})
export class FoodGroupModule {}
