import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { StationPackageItemEntity } from './entiies/stationPackageItem.entity';
import { PackagesModule } from '../packages/packages.module';
import { StationsModule } from '../stations/stations.module';
import { StationPackageItemService } from './stationPackageItem.service';
import { StationPackageItemProfile } from './profile/stationPackageItem.profile';
import { StationPackageItemController } from './stationPackageItem.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([StationPackageItemEntity]),
    PackagesModule,
    StationsModule,
  ],
  controllers: [StationPackageItemController],
  providers: [StationPackageItemService, StationPackageItemProfile],
  exports: [StationPackageItemService],
})
export class StationPackageItemModule {}
