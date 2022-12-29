import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusEnum } from 'src/common/enums/status.enum';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { FoodGroupService } from '../food-group/food-group.service';
import { PackageService } from '../packages/packages.service';
import { TimeFrameService } from '../time-frame/time-frame.service';
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
    private readonly frameService: TimeFrameService,
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
    const { itemCode, packageID, foodGroupID } = data;
    const packageCheck = await this.packageService.findOne({
      where: { id: packageID },
    });
    const foodGroupCheck = await this.foodGroupService.findOne({
      where: { id: foodGroupID },
    });
    // const frameCheck = await this.frameService.findOne({
    //   where: { id: timeFrameID },
    // });
    if (!packageCheck) {
      throw new HttpException(
        `${packageID} package:  not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    // if (!frameCheck) {
    //   throw new HttpException(
    //     `${timeFrameID} frame:  not found`,
    //     HttpStatus.NOT_FOUND,
    //   );
    // }

    if (!foodGroupCheck) {
      throw new HttpException(
        `${foodGroupID} foodGroup: Not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    if (foodGroupCheck.status == StatusEnum.IN_ACTIVE) {
      throw new HttpException(
        'Food Group is InActive can not add',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newPackageItem = await this.packageItemRepository.save({
      itemCode: itemCode,
      // timeFrame: frameCheck,
      deliveryDate: data.deliveryDate,
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
    if (foodGroupCheck.status == StatusEnum.IN_ACTIVE) {
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
