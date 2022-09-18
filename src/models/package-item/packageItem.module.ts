import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackagesModule } from '../packages/packages.module';
import { PackageItemEntity } from './entities/packageItem.entity';
import { PackageItemController } from './packageItem.controller';
import { PackageItemService } from './packageItem.service';
import { PackageItemProfile } from './profile/packageItem.profile';

@Module({
  imports: [TypeOrmModule.forFeature([PackageItemEntity]), PackagesModule],
  controllers: [PackageItemController],
  providers: [PackageItemService, PackageItemProfile],
})
export class PackageItemModule {}
