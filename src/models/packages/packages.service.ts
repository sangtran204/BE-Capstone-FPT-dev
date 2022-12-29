import { Like, Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../base/base.service';
import { PackageEntity } from './entities/packages.entity';
import { StatusEnum } from 'src/common/enums/status.enum';
import { CreatePackageDTO } from './dto/create-package.dto';
import { TimeFrameService } from '../time-frame/time-frame.service';
import { UpdatePackageDTO } from './dto/update-package.dto';
import { InjectMapper } from '@automapper/nestjs';
import { PackageCategoriesService } from '../package-categories/package-categories.service';
import { Mapper } from '@automapper/core';
import { PackageFilterDTO } from './dto/package-filter.dto';

@Injectable()
export class PackageService extends BaseService<PackageEntity> {
  constructor(
    @InjectRepository(PackageEntity)
    private readonly packagesRepository: Repository<PackageEntity>,
    private readonly frameService: TimeFrameService,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly categoryService: PackageCategoriesService,
  ) {
    super(packagesRepository);
  }

  // async getFoodOnPackage(): Promise<FoodDTO[]> {
  //   const list = await this.foodsRepository
  //     .createQueryBuilder('foods')
  //     .select('foods.id, foods.name, foods.image')
  //     .leftJoin()
  // }

  async listAllPackage(): Promise<PackageEntity[]> {
    return await this.packagesRepository.find({
      relations: {
        // timeFrame: true,
        packageCategory: true,
        packageItem: true,
      },
    });
  }

  async getPackageByStatus(
    packageFilter: PackageFilterDTO,
  ): Promise<PackageEntity[]> {
    const { statusPackage } = packageFilter;
    return await this.packagesRepository.find({
      where: { status: Like(Boolean(statusPackage) ? statusPackage : '%%') },
      relations: {
        // timeFrame: true,
        packageCategory: true,
        packageItem: true,
      },
    });
  }

  async createPackage(
    data: CreatePackageDTO,
    image: Express.Multer.File,
  ): Promise<PackageEntity> {
    // const frame = await this.frameService.findOne({
    //   where: { id: data.timeFrameID },
    // });
    const category = await this.categoryService.findOne({
      where: { id: data.categoryID },
    });
    if (data.startSale > data.endSale)
      throw new HttpException(
        'start Sale must less than end Sale',
        HttpStatus.BAD_REQUEST,
      );
    // if (!frame) {
    //   throw new HttpException(
    //     `Frame ID not found : ${data.timeFrameID}`,
    //     HttpStatus.NOT_FOUND,
    //   );
    // }
    if (!category) {
      throw new HttpException(
        `Category ID not found: ${data.categoryID}`,
        HttpStatus.NOT_FOUND,
      );
    }
    const imageRes = await this.uploadImageToFirebase(image);
    return await this.save({
      startSale: data.startSale,
      endSale: data.endSale,
      name: data.name,
      description: data.description,
      price: data.price,
      image: imageRes,
      totalDate: data.totalDate,
      totalFood: data.totalFood,
      totalMeal: data.totalMeal,
      // totalStation: data.totalStation,
      // timeFrame: frame,
      packageCategory: category,
    });
  }

  async updatePackage(
    id: string,
    data: UpdatePackageDTO,
    image: Express.Multer.File,
  ): Promise<string> {
    const packageId = await this.packagesRepository.findOne({
      where: { id: id },
    });
    if (!packageId) {
      throw new HttpException(`${id} not found`, HttpStatus.NOT_FOUND);
    } else {
      // const frame = await this.frameService.findOne({
      //   where: { id: data.timeFrameID },
      // });
      const category = await this.categoryService.findOne({
        where: { id: data.categoryID },
      });
      if (data.startSale > data.endSale)
        throw new HttpException(
          'start Sale must less than end Sale',
          HttpStatus.BAD_REQUEST,
        );
      // if (!frame) {
      //   throw new HttpException(
      //     `Frame ID not found : ${data.timeFrameID}`,
      //     HttpStatus.NOT_FOUND,
      //   );
      // } else
      if (!category) {
        throw new HttpException(
          `Category ID not found: ${data.categoryID}`,
          HttpStatus.NOT_FOUND,
        );
      } else {
        const imageRes = await this.uploadImageToFirebase(image);
        await this.save({
          id: id,
          startSale: data.startSale,
          endSale: data.endSale,
          name: data.name,
          description: data.description,
          price: data.price,
          image: imageRes,
          totalDate: data.totalDate,
          totalFood: data.totalFood,
          totalMeal: data.totalMeal,
          // totalStation: data.totalStation,
          // timeFrame: frame,
          packageCategory: category,
        });
        return 'Update Package Successful';
      }
    }
  }

  async confirmPackage(id: string): Promise<string> {
    const packages = await this.packagesRepository.findOne({
      where: { id: id },
    });
    if (!packages) {
      throw new HttpException(
        `Package Id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    } else {
      if (packages.status == StatusEnum.WAITING) {
        await this.packagesRepository.update(
          { id: id },
          {
            status: StatusEnum.ACTIVE,
          },
        );
        return 'Package is active';
      } else if (packages.status == StatusEnum.ACTIVE) {
        await this.packagesRepository.update(
          { id: id },
          {
            status: StatusEnum.IN_ACTIVE,
          },
        );
        return 'Package is inActive';
      } else if (packages.status == StatusEnum.IN_ACTIVE) {
        await this.packagesRepository.update(
          { id: id },
          {
            status: StatusEnum.ACTIVE,
          },
        );
        return 'Package is active';
      }
    }
  }

  async deletePackage(id: string): Promise<string> {
    const packages = await this.packagesRepository.findOne({
      where: { id: id },
    });
    if (packages) {
      await this.packagesRepository
        .createQueryBuilder()
        .delete()
        .from(PackageEntity)
        .where('id = :id', { id: id })
        .execute();
      return `Delete Successfully : ${id}`;
    } else {
      throw new HttpException(`${id} not found`, HttpStatus.NOT_FOUND);
    }
  }

  async getActivePackageByCategory(
    categoryId: string,
  ): Promise<PackageEntity[]> {
    const listPackage = await this.packagesRepository
      .createQueryBuilder('packages')
      .leftJoinAndSelect('packages.timeFrame', 'time_frame')
      .leftJoinAndSelect('packages.packageCategory', 'package_categories')
      .where('packages.packageCategory.id = :id', {
        id: categoryId,
      })
      // .where('packages.timeFrame.id = time_frame.id')
      // .andWhere('packages.timeFrame.id')
      .andWhere('packages.status = :status', { status: 'active' })
      .getMany();
    if (!listPackage || listPackage.length == 0) {
      throw new HttpException('No package found', HttpStatus.NOT_FOUND);
    }
    return listPackage;
  }
}
