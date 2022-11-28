import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { StationEntity } from './entities/stations.entity';
import { StationsController } from './stations.controller';
import { StationsService } from './stations.service';
import { StationProfile } from './profile/station.profile';
import { KitchenModule } from '../kitchens/kitchens.module';

@Module({
  imports: [TypeOrmModule.forFeature([StationEntity]), KitchenModule],
  controllers: [StationsController],
  providers: [StationsService, StationProfile],
  exports: [StationsService],
})
export class StationsModule {}
