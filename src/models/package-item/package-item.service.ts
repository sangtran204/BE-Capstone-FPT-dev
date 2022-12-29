import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FoodGroupEnum } from 'src/common/enums/food-group.enum';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { FoodGroupService } from '../food-group/food-group.service';
import { PackageService } from '../packages/packages.service';
import { CreatePackageItemDTO } from './dto/create-package-item.dto';
import { UpdatePackageItemDTO } from './dto/update-package-item';
import { PackageItemEntity } from './entities/package-item.entity';

@Injectable()
export class PackageItemService extends BaseService<PackageItemEntity> {
  constructor(
    @InjectRepository(PackageItemEntity)
    private readonly packageItemRepository: Repository<PackageItemEntity>,
    private readonly foodGroupService: FoodGroupService,
    private readonly packageService: PackageService,
  ) {
    super(packageItemRepository);
  }

  async getAllPackageItem(): Promise<PackageItemEntity[]> {
    return await this.packageItemRepository.find({
      relations: { foodGroup: true },
    });
  }

  async createPackageItem(
    data: CreatePackageItemDTO,
  ): Promise<PackageItemEntity> {
    const { itemCode, deliveryDate, packageID, foodGroupID } = data;
    const packageCheck = await this.packageService.findOne({
      where: { id: packageID },
    });
    const foodGroupCheck = await this.foodGroupService.findOne({
      where: { id: foodGroupID },
    });
    if (!packageCheck) {
      throw new HttpException(
        `${packageID} package:  not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (!foodGroupCheck) {
      throw new HttpException(
        `${foodGroupID} foodGroup: Not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    if (foodGroupCheck.status == FoodGroupEnum.IN_ACTIVE) {
      throw new HttpException(
        'Food Group is InActive can not add',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newPackageItem = await this.packageItemRepository.save({
      itemCode: itemCode,
      deliveryDate: deliveryDate,
      packages: packageCheck,
      foodGroup: foodGroupCheck,
    });
    return await this.findOne({
      where: { id: newPackageItem.id },
      relations: { foodGroup: true },
    });
  }

  async deletePackageItem(id: string): Promise<string> {
    const item = await this.packageItemRepository.findOne({
      where: { id: id },
    });
    if (!item) {
      throw new HttpException(
        `PackageItem id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    } else {
      try {
        await this.packageItemRepository
          .createQueryBuilder()
          .delete()
          .from(PackageItemEntity)
          .where('id = :id', { id: id })
          .execute();
        return 'Package item deleted';
      } catch (error) {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
    }
  }

  async updatePackageItem(
    id: string,
    dto: UpdatePackageItemDTO,
  ): Promise<string> {
    const { foodGroupID } = dto;
    const item = await this.packageItemRepository.findOne({
      where: { id: id },
    });

    if (!item) {
      throw new HttpException(
        `Package item ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    const foodGroupCheck = await this.foodGroupService.findOne({
      where: { id: foodGroupID },
    });

    if (!foodGroupCheck) {
      throw new HttpException(
        `${foodGroupID} foodGroup: Not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    if (foodGroupCheck.status == FoodGroupEnum.IN_ACTIVE) {
      throw new HttpException(
        'Food Group is InActive can not add',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.packageItemRepository.save({
      id: id,
      foodGroup: foodGroupCheck,
    });
    return 'Package item updated successful';
  }
}
