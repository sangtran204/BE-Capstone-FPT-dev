import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CategoryEntity } from './entities/categories.entity';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
// import { CategoriesProfile } from './profile/categories.profile';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
