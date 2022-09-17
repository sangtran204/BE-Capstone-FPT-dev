import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { PackageItemFoodDTO } from './dto/packageItemFood.dto';
import { PackageItemFoodEntity } from './entities/packageItemFood.entity';

@Injectable()
export class PackageItemFoodService extends BaseService<PackageItemFoodEntity> {
  constructor(
    @InjectRepository(PackageItemFoodEntity)
    private readonly packageItemFoodRepository: Repository<PackageItemFoodEntity>,
  ) {
    super(packageItemFoodRepository);
  }

  async getAllPackageItemFood(): Promise<PackageItemFoodEntity[]> {
    return await this.packageItemFoodRepository.find();
  }

  async deletePackageItemFood(id: string): Promise<string> {
    const itemFood = await this.packageItemFoodRepository.findOne({
      where: { id: id },
    });
    if (!itemFood) {
      throw new HttpException(
        `PackageItemFood ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    } else {
      try {
        await this.packageItemFoodRepository
          .createQueryBuilder()
          .delete()
          .from(PackageItemFoodEntity)
          .where('id = :id', { id: id })
          .execute();
        return 'PackageItemFood deleted';
      } catch (error) {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
    }
  }

  async updatePackageItemFood(
    id: string,
    dto: PackageItemFoodDTO,
  ): Promise<string> {
    const itemFood = await this.packageItemFoodRepository.findOne({
      where: { id: id },
    });

    if (!itemFood) {
      throw new HttpException(
        `PackageItemFood ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    } else {
      try {
        await this.packageItemFoodRepository.update(
          { id: id },
          {
            maxFood: dto.maxFood,
          },
        );
        return 'PackageItemFood updated';
      } catch (error) {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
    }
  }
}
