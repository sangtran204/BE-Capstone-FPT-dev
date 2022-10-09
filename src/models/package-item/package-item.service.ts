import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { FoodGroupService } from '../food-group/food-group.service';
import { PackageService } from '../packages/packages.service';
import { CreatePackageItemDTO } from './dto/create-package-item.dto';
import { PackageItemDTO } from './dto/package-item.dto';
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
      relations: { foodGroups: true },
    });
  }

  async createPackageItem(
    data: CreatePackageItemDTO,
  ): Promise<PackageItemEntity> {
    const {
      deliveryDate,
      maxFood,
      totalGroup,
      packageID,
      timeFrameID,
      foodGroupIds,
    } = data;
    const packageCheck = await this.packageService.findOne({
      where: { id: packageID },
    });
    if (!packageCheck) {
      throw new HttpException(
        `${packageID} package:  not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    const foodGroup = await this.foodGroupService.query({
      where: foodGroupIds.map((id) => ({ id })),
    });
    if (!foodGroup || foodGroup.length === 0) {
      throw new HttpException(
        'Not found FoodGroup in system',
        HttpStatus.NOT_FOUND,
      );
    }
    if (foodGroup.length > totalGroup) {
      throw new HttpException(
        'FoodGroups must be less than or equal to TotalFood',
        HttpStatus.NOT_FOUND,
      );
    }
    const newPackage = await this.packageItemRepository.save({
      deliveryDate: deliveryDate,
      totalGroup: totalGroup,
      maxFood: maxFood,
      foodGroup,
    });
    return await this.findOne({
      where: { id: newPackage.id },
      relations: { foodGroups: true },
    });
  }

  // async deletePackageItem(id: string): Promise<string> {
  //   const item = await this.packageItemRepository.findOne({
  //     where: { id: id },
  //   });
  //   if (!item) {
  //     throw new HttpException(
  //       `PackageItem id ${id} not found`,
  //       HttpStatus.NOT_FOUND,
  //     );
  //   } else {
  //     try {
  //       await this.packageItemRepository
  //         .createQueryBuilder()
  //         .delete()
  //         .from(PackageItemEntity)
  //         .where('id = :id', { id: id })
  //         .execute();
  //       return 'Package item deleted';
  //     } catch (error) {
  //       throw new HttpException(error, HttpStatus.BAD_REQUEST);
  //     }
  //   }
  // }

  // async updatePackageItem(id: string, dto: PackageItemDTO): Promise<string> {
  //   const item = await this.packageItemRepository.findOne({
  //     where: { id: id },
  //   });

  //   if (!item) {
  //     throw new HttpException(
  //       `Package item ${id} not found`,
  //       HttpStatus.NOT_FOUND,
  //     );
  //   } else {
  //     try {
  //       await this.packageItemRepository.update(
  //         { id: id },
  //         {
  //           startDate: dto.startDate,
  //           endDate: dto.endDate,
  //           maxFood: dto.maxFood,
  //           maxAmount: dto.maxAmount,
  //         },
  //       );
  //       return 'Package item updated';
  //     } catch (error) {
  //       throw new HttpException(error, HttpStatus.BAD_REQUEST);
  //     }
  //   }
  // }
}
