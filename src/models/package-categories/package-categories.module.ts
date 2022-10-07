import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackageCategoryEntity } from './entities/package-categories.entity';
import { PackgeCategoriesController } from './package-categories.controller';
import { PackageCategoriesService } from './package-categories.service';
import { PackageCategoriesProfile } from './profile/package-categories.profile';

@Module({
  imports: [TypeOrmModule.forFeature([PackageCategoryEntity])],
  controllers: [PackgeCategoriesController],
  providers: [PackageCategoriesService, PackageCategoriesProfile],
  exports: [PackageCategoriesService],
})
export class PackageCategoriesModule {}
