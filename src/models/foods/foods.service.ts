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

@Injectable()
export class FoodsService extends BaseService<FoodEntity> {
  constructor(
    @InjectRepository(FoodEntity)
    private readonly foodsRepository: Repository<FoodEntity>,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly imageService: ImagesService,
  ) {
    super(foodsRepository);
  }

  async getAllFood(): Promise<FoodEntity[]> {
    return await this.foodsRepository.find();
  }

  async getAllActiveFood(): Promise<FoodEntity[]> {
    return await this.foodsRepository.find({
      where: { isActive: IsActiveEnum.ACTIVE },
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
}
