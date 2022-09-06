import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { StationEntity } from './entities/stations.entity';
import { StationsController } from './stations.controller';
import { StationsService } from './stations.service';

@Module({
  imports: [TypeOrmModule.forFeature([StationEntity])],
  controllers: [StationsController],
  providers: [StationsService],
  exports: [StationsService],
})
export class StationsModule {}
