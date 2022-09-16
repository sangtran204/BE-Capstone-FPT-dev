import { Repository } from 'typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../base/base.service';
import { FoodEntity } from './entities/foods.entity';
import { IsActiveEnum } from 'src/common/enums/isActive.enum';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { FoodCategoriesService } from '../food-categories/food-categories.service';
import { CreateFoodDTO } from './dto/create-food.dto';
import { randomUUID } from 'crypto';
import { getStorage } from 'firebase-admin/storage';
import { UpdateFoodDTO } from './dto/update-food.dto';

@Injectable()
export class FoodsService extends BaseService<FoodEntity> {
  constructor(
    @InjectRepository(FoodEntity)
    private readonly foodsRepository: Repository<FoodEntity>,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly foodCategoryService: FoodCategoriesService,
  ) {
    super(foodsRepository);
  }

  async uploadImageToFirebase(image: Express.Multer.File): Promise<string> {
    try {
      const imageName = image.originalname.split('.');
      const newImageName = randomUUID() + '.' + imageName[imageName.length - 1];
      const url = `images/${newImageName}`;

      const bucket = getStorage().bucket();
      const file = bucket.file(url);
      const contents = image.buffer;
      await file.save(contents);

      return await `https://firebasestorage.googleapis.com/v0/b/${
        bucket.name
      }/o/${encodeURIComponent(url)}?alt=media`;
    } catch (error) {
      throw new HttpException(`${error}`, HttpStatus.BAD_REQUEST);
    }
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

  async createFood(
    data: CreateFoodDTO,
    image: Express.Multer.File,
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
      const imageRes = await this.uploadImageToFirebase(image);
      return await this.save({
        name: data.name,
        description: data.description,
        price: data.price,
        image: imageRes,
        foodCategory: category,
      });
    }
  }

  async updateFood(
    id: string,
    data: UpdateFoodDTO,
    image: Express.Multer.File,
  ): Promise<string> {
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
    const imageRes = await this.uploadImageToFirebase(image);
    await this.save({
      id: id,
      name: data.name,
      description: data.description,
      price: data.price,
      image: imageRes,
      foodCategory: category,
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

// async createFood(
//   data: CreateFoodDTO,
//   images: Express.Multer.File,
// ): Promise<FoodEntity> {
//   const category = await this.foodCategoryService.findOne({
//     where: { id: data.foodCategoryId },
//   });
//   if (!category) {
//     throw new HttpException(
//       `Category ID not found : ${data.foodCategoryId}`,
//       HttpStatus.NOT_FOUND,
//     );
//   } else {
//     const urlImageDTO = await this.imageService.uploadImagesToFirebase(
//       images,
//     );

//     const food = await this.save({
//       name: data.name,
//       description: data.description,
//       price: data.price,
//       foodCategory: category,
//     });
//     const listImageEntityPromise: Promise<ImageEntity>[] = [];
//     for (const item of urlImageDTO) {
//       listImageEntityPromise.push(
//         this.imageService.save({ url: item.url, food: food }),
//       );
//     }
//     const listImage = await Promise.all(listImageEntityPromise);

//     await this.save({
//       id: food.id,
//       images: listImage,
//     });

//     return await this.findOne({
//       where: { id: food.id },
//       relations: { images: true },
//     });
//   }
// }

// async addImagesFood(
//   id: string,
//   images: Array<Express.Multer.File>,
// ): Promise<string> {
//   const foodId = await this.findOne({ where: { id: id } });
//   if (!foodId) {
//     throw new HttpException(`${id} not found`, HttpStatus.NOT_FOUND);
//   }
//   const urlImageDTO = await this.imageService.uploadImagesToFirebase(images);
//   const promiseImages: Promise<ImageEntity>[] = [];
//   for (const item of urlImageDTO) {
//     promiseImages.push(
//       this.imageService.save({ url: item.url, food: foodId }),
//     );
//   }
//   let message = '';
//   await Promise.all(promiseImages)
//     .then(() => {
//       message = 'Upload Images Successfully';
//     })
//     .catch(() => {
//       throw new HttpException('Upload Images fail', HttpStatus.BAD_REQUEST);
//     });
//   return message;
// }
