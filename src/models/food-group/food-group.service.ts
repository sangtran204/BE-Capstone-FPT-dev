import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../base/base.service';
import { IsActiveEnum } from 'src/common/enums/isActive.enum';
import { FoodGroupEntity } from './entities/food-group.entity';
import { CreateFoodGroupDTO } from './dto/create-food-group.dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { UpdateFoodGroupDTO } from './dto/update-food-group.dto';

@Injectable()
export class FoodGroupService extends BaseService<FoodGroupEntity> {
  constructor(
    @InjectRepository(FoodGroupEntity)
    private readonly foodGroupRepository: Repository<FoodGroupEntity>,
    @InjectMapper() private readonly mapper: Mapper,
  ) {
    super(foodGroupRepository);
  }

  async getAllFoodGroup(): Promise<FoodGroupEntity[]> {
    return await this.foodGroupRepository.find();
  }

  async getFoodGroupActive(): Promise<FoodGroupEntity[]> {
    return await this.foodGroupRepository.find({
      where: { isActive: IsActiveEnum.ACTIVE },
    });
  }

  async createFoodGroup(
    data: CreateFoodGroupDTO,
    image: Express.Multer.File,
  ): Promise<FoodGroupEntity> {
    const imageRes = await this.uploadImageToFirebase(image);
    return await this.save({
      name: data.name,
      description: data.description,
      totalFood: data.totalFood,
      image: imageRes,
    });
  }

  async updateFoodGroup(
    id: string,
    data: UpdateFoodGroupDTO,
    image: Express.Multer.File,
  ): Promise<string> {
    const foodGroup = await this.foodGroupRepository.findOne({
      where: { id: id },
    });
    if (!foodGroup) {
      throw new HttpException(
        `${id} food group not found`,
        HttpStatus.NOT_FOUND,
      );
    } else {
      try {
        const imageRes = await this.uploadImageToFirebase(image);
        await this.save({
          id: id,
          name: data.name,
          description: data.description,
          totalFood: data.totalFood,
          image: imageRes,
        });
        return 'Update food group successfull';
      } catch (error) {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
    }
  }

  async updateFoodGroupStatus(id: string): Promise<string> {
    const foodGr = await this.foodGroupRepository.findOne({
      where: { id: id },
    });
    if (!foodGr) {
      throw new HttpException(`${id} not found`, HttpStatus.NOT_FOUND);
    } else {
      await this.foodGroupRepository.update(
        { id: id },
        {
          isActive: IsActiveEnum.ACTIVE,
        },
      );
      return 'Food group active';
    }
  }

  async removeFoodGroup(id: string): Promise<string> {
    const foodGr = await this.foodGroupRepository.findOne({
      where: { id: id },
    });
    if (!foodGr) {
      throw new HttpException(`${id} not found`, HttpStatus.NOT_FOUND);
    } else {
      await this.foodGroupRepository.update(
        { id: id },
        { isActive: IsActiveEnum.IN_ACTIVE },
      );
      return 'Food group inactive';
    }
  }
}
