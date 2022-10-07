import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { PackageCategoryEntity } from './entities/package-categories.entity';

@Injectable()
export class PackageCategoriesService extends BaseService<PackageCategoryEntity> {
  constructor(
    @InjectRepository(PackageCategoryEntity)
    private readonly packgeCategoriesRepository: Repository<PackageCategoryEntity>,
  ) {
    super(packgeCategoriesRepository);
  }

  async getAllPackageCategories(): Promise<PackageCategoryEntity[]> {
    return await this.packgeCategoriesRepository.find();
  }

  async createPackageCategories(
    name: string,
    image: Express.Multer.File,
  ): Promise<PackageCategoryEntity> {
    const imageRes = await this.uploadImageToFirebase(image);
    return await this.save({
      name: name,
      image: imageRes,
    });
  }

  async getCategoryHasPackageActive(): Promise<PackageCategoryEntity[]> {
    const categoryList = await this.packgeCategoriesRepository
      .createQueryBuilder('package_categories')
      .leftJoinAndSelect('package_categories.packages', 'packages')
      .where('packages.status = :status', { status: 'active' })
      .getMany();
    if (!categoryList || categoryList.length == 0) {
      throw new HttpException('No package item found', HttpStatus.NOT_FOUND);
    }
    return categoryList;
  }

  async updatePackageCategory(
    id: string,
    name: string,
    image: Express.Multer.File,
  ): Promise<string> {
    const category = await this.packgeCategoriesRepository.findOne({
      where: { id: id },
    });
    const imageRes = await this.uploadImageToFirebase(image);
    if (!category) {
      throw new HttpException(
        `Category id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.packgeCategoriesRepository.update(
      { id: id },
      { name: name, image: imageRes },
    );

    return 'Package Category updated';
  }
}
