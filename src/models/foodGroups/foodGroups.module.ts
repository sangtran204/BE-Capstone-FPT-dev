import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { FoodGroupEntity } from './entities/foodGroups.entity';
import { FoodGroupController } from './foodGroups.controller';
import { FoodGroupService } from './foodGroups.service';
import { FoodGroupProfile } from './profile/foodGroup.profile';

@Module({
  imports: [TypeOrmModule.forFeature([FoodGroupEntity])],
  controllers: [FoodGroupController],
  providers: [FoodGroupService, FoodGroupProfile],
  exports: [FoodGroupService],
})
export class FoodGroupModule {}
