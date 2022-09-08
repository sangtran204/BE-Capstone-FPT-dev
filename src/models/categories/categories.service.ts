import { Repository } from 'typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
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

  async updateCategory(id: string, data: CategoryDTO): Promise<string> {
    const cateId = await this.categoriesRepository.findOne({
      where: { id: id },
    });
    if (!cateId) {
      throw new HttpException(`${id} not found`, HttpStatus.NOT_FOUND);
    } else {
      await this.save({ id: id, name: data.name });
      return `Update Sucessfully ${id}`;
    }
  }

  async deleteCategoryById(id: string): Promise<string> {
    const cateId = await this.categoriesRepository.findOne({
      where: { id: id },
    });
    if (!cateId) {
      throw new HttpException(`${id} not found`, HttpStatus.NOT_FOUND);
    } else {
      await this.categoriesRepository
        .createQueryBuilder()
        .delete()
        .from(CategoryEntity)
        .where('id = :id', { id: id })
        .execute();
      return `Delete Successfully : ${id}`;
    }
  }
}
