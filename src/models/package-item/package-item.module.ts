import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodGroupModule } from '../food-group/food-group.module';
import { PackagesModule } from '../packages/packages.module';
import { PackageItemEntity } from './entities/package-item.entity';
import { PackageItemController } from './package-item.controller';
import { PackageItemService } from './package-item.service';
import { PackageItemProfile } from './profile/package-item.profile';

@Module({
  imports: [
    TypeOrmModule.forFeature([PackageItemEntity]),
    PackagesModule,
    FoodGroupModule,
  ],
  controllers: [PackageItemController],
  providers: [PackageItemService, PackageItemProfile],
  exports: [PackageItemService],
})
export class PackageItemModule {}
