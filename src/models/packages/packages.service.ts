import { Repository } from 'typeorm';
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

  async listAllPackage(): Promise<PackageEntity[]> {
    return await this.packagesRepository.find({
      relations: { timeFrame: true, packageCategory: true },
    });
  }

  async createPackage(
    data: CreatePackageDTO,
    image: Express.Multer.File,
  ): Promise<PackageEntity> {
    const frame = await this.frameService.findOne({
      where: { id: data.timeFrameID },
    });
    const category = await this.categoryService.findOne({
      where: { id: data.categoryID },
    });
    if (data.startSale > data.endSale)
      throw new HttpException(
        'start Sale must less than end Sale',
        HttpStatus.BAD_REQUEST,
      );
    if (!frame) {
      throw new HttpException(
        `Frame ID not found : ${data.timeFrameID}`,
        HttpStatus.NOT_FOUND,
      );
    }
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
      totalStation: data.totalStation,
      timeFrame: frame,
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
      const frame = await this.frameService.findOne({
        where: { id: data.timeFrameID },
      });
      const category = await this.categoryService.findOne({
        where: { id: data.categoryID },
      });
      if (data.startSale > data.endSale)
        throw new HttpException(
          'start Sale must less than end Sale',
          HttpStatus.BAD_REQUEST,
        );
      if (!frame) {
        throw new HttpException(
          `Frame ID not found : ${data.timeFrameID}`,
          HttpStatus.NOT_FOUND,
        );
      } else if (!category) {
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
          totalStation: data.totalStation,
          timeFrame: frame,
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
}
