import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PackageService } from './packages.service';
import { PackageController } from './packages.controller';
import { PackageEntity } from './entities/packages.entity';
import { PackageProfile } from './profile/package.profile';
import { TimeFrameModule } from '../time-frame/time-frame.module';

@Module({
  imports: [TypeOrmModule.forFeature([PackageEntity]), TimeFrameModule],
  controllers: [PackageController],
  providers: [PackageService, PackageProfile],
  exports: [PackageService],
})
export class PackagesModule {}
