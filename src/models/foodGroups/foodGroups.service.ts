import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../base/base.service';
import { IsActiveEnum } from 'src/common/enums/isActive.enum';
import { FoodGroupDTO } from './dto/foodGroup.dto';
import { FoodGroupEntity } from './entities/foodGroups.entity';

@Injectable()
export class FoodGroupService extends BaseService<FoodGroupEntity> {
  constructor(
    @InjectRepository(FoodGroupEntity)
    private readonly foodGroupRepository: Repository<FoodGroupEntity>,
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

  async createFoodGroup(dto: FoodGroupDTO): Promise<string> {
    try {
      await this.foodGroupRepository.save({
        name: dto.name,
        description: dto.description,
        totalFood: dto.totoFood,
        img: dto.img,
      });
      return 'Create food group successfull';
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async updateFoodGroup(id: string, dto: FoodGroupDTO): Promise<string> {
    const foodGr = await this.foodGroupRepository.findOne({
      where: { id: id },
    });
    if (!foodGr) {
      throw new HttpException(`${id} not found`, HttpStatus.NOT_FOUND);
    } else {
      try {
        await this.foodGroupRepository.update(
          { id: id },
          {
            name: dto.name,
            description: dto.description,
            totalFood: dto.totoFood,
            img: dto.img,
          },
        );
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

  async deleteFoodGroup(id: string): Promise<string> {
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
