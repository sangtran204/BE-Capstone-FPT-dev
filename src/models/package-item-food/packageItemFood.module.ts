import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackageItemFoodEntity } from './entities/packageItemFood.entity';
import { PackageItemFoodController } from './packageItemFood.controller';
import { PackageItemFoodService } from './packageItemFood.service';
import { PackageItemFoodProfile } from './profile/packageItemFood.profile';

@Module({
  imports: [TypeOrmModule.forFeature([PackageItemFoodEntity])],
  controllers: [PackageItemFoodController],
  providers: [PackageItemFoodService, PackageItemFoodProfile],
})
export class PackageItemFoodModule {}
