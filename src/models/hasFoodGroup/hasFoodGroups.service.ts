import { Repository } from 'typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../base/base.service';
import { HasFoodGroupEntity } from './entities/hasFoodGroup.entity';
import { HasFoodGroupDTO } from './dto/hasFoodGroup.dto';
import { PackageService } from '../packages/packages.service';
import { FoodGroupService } from '../foodGroups/foodGroups.service';

@Injectable()
export class HasFoodGroupService extends BaseService<HasFoodGroupEntity> {
  constructor(
    @InjectRepository(HasFoodGroupEntity)
    private readonly hasFoodGroupRepository: Repository<HasFoodGroupEntity>,
    private readonly packageService: PackageService,
    private readonly foodGroupService: FoodGroupService,
  ) {
    super(hasFoodGroupRepository);
  }

  async getAllHasFoodGroup(): Promise<HasFoodGroupEntity[]> {
    return await this.hasFoodGroupRepository.find();
  }

  async getHasFoodGroupByPackage(id: string): Promise<HasFoodGroupEntity[]> {
    return await this.hasFoodGroupRepository
      .createQueryBuilder()
      .select()
      .where('packageId = :packages', { packages: id })
      .execute();
  }

  async creatHasFoodGroup(dto: HasFoodGroupDTO): Promise<string> {
    try {
      const packages = await this.packageService.findOne({
        where: { id: dto.packageId },
      });
      const group = await this.foodGroupService.findOne({
        where: { id: dto.hasGroupId },
      });

      if (!packages) {
        throw new HttpException(
          `package id ${dto.packageId} not found`,
          HttpStatus.NOT_FOUND,
        );
      } else if (!group) {
        throw new HttpException(
          `foodGroup id ${dto.hasGroupId} not found`,
          HttpStatus.NOT_FOUND,
        );
      } else {
        await this.hasFoodGroupRepository.save({
          hasGroup: group,
          package: packages,
        });
        return 'Create HasGroupPackage successfull';
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteHasFoodGroup(id: string): Promise<string> {
    try {
      const packages = await this.packageService.findOne({
        where: { id: id },
      });
      if (!packages) {
        throw new HttpException(
          `package id ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      } else {
        await this.hasFoodGroupRepository
          .createQueryBuilder()
          .delete()
          .from(HasFoodGroupEntity)
          .where('packageId = :packageId', { packageId: id })
          .execute();
        return 'Delete hasFoodGroup successfull';
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteItemHasFoodGroup(id: string): Promise<string> {
    try {
      const item = await this.hasFoodGroupRepository.findOne({
        where: { id: id },
      });
      if (!item) {
        throw new HttpException(
          `hasFoodGroup item ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      } else {
        await this.hasFoodGroupRepository
          .createQueryBuilder()
          .delete()
          .from(HasFoodGroupEntity)
          .where('id = :id', { id: id })
          .execute();
        return 'Delete item successfull';
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
