import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { HasFoodGroupEntity } from './entities/hasFoodGroup.entity';
import { HasFoodGroupController } from './hasFoodGroups.controller';
import { HasFoodGroupService } from './hasFoodGroups.service';
import { HasFoodGroupProfile } from './profile/hasFoodGroup.profile';
import { PackagesModule } from '../packages/packages.module';
import { FoodGroupModule } from '../foodGroups/foodGroups.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([HasFoodGroupEntity]),
    PackagesModule,
    FoodGroupModule,
  ],
  controllers: [HasFoodGroupController],
  providers: [HasFoodGroupService, HasFoodGroupProfile],
  exports: [HasFoodGroupService],
})
export class HasFoodGroupModule {}
