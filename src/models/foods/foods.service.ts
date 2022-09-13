import { Repository } from 'typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../base/base.service';
import { FoodEntity } from './entities/foods.entity';
import { IsActiveEnum } from 'src/common/enums/isActive.enum';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { ImagesService } from '../images/images.service';
import { ImageEntity } from '../images/entities/images.entity';
import { FoodCategoriesService } from '../food-categories/food-categories.service';
import { FoodDTO } from './dto/food.dto';

@Injectable()
export class FoodsService extends BaseService<FoodEntity> {
  constructor(
    @InjectRepository(FoodEntity)
    private readonly foodsRepository: Repository<FoodEntity>,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly imageService: ImagesService,
    private readonly foodCategoryService: FoodCategoriesService,
  ) {
    super(foodsRepository);
  }

  async getAllFood(): Promise<FoodEntity[]> {
    return await this.foodsRepository.find({
      relations: {
        foodCategory: true,
      },
    });
  }

  async getAllActiveFood(): Promise<FoodEntity[]> {
    return await this.foodsRepository.find({
      where: { isActive: IsActiveEnum.ACTIVE },
      relations: {
        foodCategory: true,
      },
    });
  }

  async addImagesFood(
    id: string,
    images: Array<Express.Multer.File>,
  ): Promise<string> {
    const foodId = await this.findOne({ where: { id: id } });
    if (!foodId) {
      throw new HttpException(`${id} not found`, HttpStatus.NOT_FOUND);
    }
    const urlImageDTO = await this.imageService.uploadImagesToFirebase(images);
    const promiseImages: Promise<ImageEntity>[] = [];
    for (const item of urlImageDTO) {
      promiseImages.push(
        this.imageService.save({ url: item.url, food: foodId }),
      );
    }
    let message = '';
    await Promise.all(promiseImages)
      .then(() => {
        message = 'Upload Images Successfully';
      })
      .catch(() => {
        throw new HttpException('Upload Images fail', HttpStatus.BAD_REQUEST);
      });
    return message;
  }

  async createFood(
    data: FoodDTO,
    // images: Array<Express.Multer.File>,
  ): Promise<FoodEntity> {
    const category = await this.foodCategoryService.findOne({
      where: { id: data.foodCategoryId },
    });
    if (!category) {
      throw new HttpException(
        `Category ID not found : ${data.foodCategoryId}`,
        HttpStatus.NOT_FOUND,
      );
    } else {
      return await this.save({
        name: data.name,
        description: data.description,
        price: data.price,
        foodCategory: category,
        images: data.images,
      });
    }
  }

  async updateFood(id: string, data: FoodDTO): Promise<string> {
    const food = await this.findOne({
      where: { id: id },
    });
    const category = await this.foodCategoryService.findOne({
      where: { id: data.foodCategoryId },
    });
    if (!food) {
      throw new HttpException(`${id} food not found`, HttpStatus.NOT_FOUND);
    }
    if (!category) {
      throw new HttpException(`${id} category not found`, HttpStatus.NOT_FOUND);
    }
    await this.save({
      id: id,
      name: data.name,
      description: data.description,
      price: data.price,
      foodCategory: category,
      images: data.images,
    });
    return `Update Food Sucessfully ${id}`;
  }

  async removeFood(id: string): Promise<string> {
    const food = await this.foodsRepository.findOne({
      where: { id: id },
    });
    if (!food) {
      throw new HttpException(`${id} not found`, HttpStatus.NOT_FOUND);
    } else {
      if (food.isActive == IsActiveEnum.ACTIVE) {
        await this.foodsRepository.update(
          { id: id },
          { isActive: IsActiveEnum.IN_ACTIVE },
        );
        return 'Food now is inActive';
      } else if (food.isActive == IsActiveEnum.IN_ACTIVE) {
        await this.foodsRepository.update(
          { id: id },
          { isActive: IsActiveEnum.ACTIVE },
        );
        return 'Food now is active';
      }
    }
  }
}
