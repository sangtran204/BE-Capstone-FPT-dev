import { Repository, UpdateResult } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/categories.entity';
import { BaseService } from '../base/base.service';
import { CategoryDTO } from './dto/category.dto';

@Injectable()
export class CategoriesService extends BaseService<CategoryEntity> {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoriesRepository: Repository<CategoryEntity>,
  ) {
    super(categoriesRepository);
  }

  async getCategories(): Promise<CategoryEntity[]> {
    return await this.categoriesRepository.find();
  }
}
