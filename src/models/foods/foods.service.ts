import { Repository } from 'typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../base/base.service';
import { FoodEntity } from './entities/foods.entity';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { FoodCategoriesService } from '../food-categories/food-categories.service';
import { CreateFoodDTO } from './dto/create-food.dto';
import { UpdateFoodDTO } from './dto/update-food.dto';
import { StatusEnum } from 'src/common/enums/status.enum';
import { count } from 'console';
import { FoodByKitchenDTO } from './dto/foodByKitchen.dto';

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

  async getAllFood(): Promise<FoodEntity[]> {
    return await this.foodsRepository.find({
      relations: {
        foodCategory: true,
      },
    });
  }

  async getAllActiveFood(): Promise<FoodEntity[]> {
    return await this.foodsRepository.find({
      where: { status: StatusEnum.ACTIVE },
      relations: {
        foodCategory: true,
      },
    });
  }

  async getAllWaitingFood(): Promise<FoodEntity[]> {
    return await this.foodsRepository.find({
      where: { status: StatusEnum.WAITING },
      relations: {
        foodCategory: true,
      },
    });
  }

  async getFoodByCategory(idCate: string): Promise<FoodEntity[]> {
    const category = await this.foodCategoryService.findOne({
      where: { id: idCate },
    });
    if (!category) {
      throw new HttpException('Not found category', HttpStatus.NOT_FOUND);
    }
    const foodList = await this.foodsRepository
      .createQueryBuilder('foods')
      .leftJoinAndSelect('foods.foodCategory', 'food_categories')
      .where('food_categories.id = :id', {
        id: idCate,
      })
      .andWhere('foods.status = :status', {
        status: StatusEnum.ACTIVE,
      })
      .getMany();
    if (!foodList || foodList.length === 0) {
      throw new HttpException(
        "Don't have resource food for this category",
        HttpStatus.NOT_FOUND,
      );
    }
    return foodList;
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

  async updateStatusFood(id: string): Promise<string> {
    const food = await this.foodsRepository.findOne({
      where: { id: id },
    });
    if (!food) {
      throw new HttpException(`${id} not found`, HttpStatus.NOT_FOUND);
    } else {
      if (food.status == StatusEnum.ACTIVE) {
        await this.foodsRepository.update(
          { id: id },
          { status: StatusEnum.IN_ACTIVE },
        );
        return 'Food now is inActive';
      } else if (food.status == StatusEnum.IN_ACTIVE) {
        await this.foodsRepository.update(
          { id: id },
          { status: StatusEnum.ACTIVE },
        );
        return 'Food now is active';
      }
    }
  }

  // async getFoodByKitchen(kitchenId: string): Promise<FoodByKitchenDTO[]> {
  //   const list = await this.foodsRepository
  //     .createQueryBuilder()
  //     .select(
  //       'foods.name, foods.description, time_slots.flag, count(foods.id) as quantity',
  //     )
  //     .from('foods', 'foods')
  //     .leftJoinAndSelect('orders', 'orders', 'foods.id = oders.foodId')
  //     .leftJoinAndSelect(
  //       'time_slots',
  //       'time_slots',
  //       'orders.timeSlotId = time_slots.id',
  //     )
  //     .where('orders.kitchenId =: kitchenId', { kitchenId: kitchenId })
  //     .groupBy(
  //       'foods.name, foods.description, time_slots.flag, count(foods.id) as quantity',
  //     )
  //     .getMany();

  //   if (!list || list.length == 0) {
  //     throw new HttpException('No food found', HttpStatus.NOT_FOUND);
  //   } else {
  //     return list;
  //   }
  // }

  // async getFoodByKitchen(
  //   kitchenId: string,
  //   // deliveryDate: string,
  // ): Promise<FoodByKitchenDTO> {
  //   const list = await this.foodsRepository
  //     .createQueryBuilder('foods')
  //     .select('foods.name, time_slots.flag, count(foods.id)')
  //     // .from('foods')
  //     .leftJoinAndSelect('foods.orders', 'orders')
  //     .leftJoinAndSelect('orders.time_slots', 'time_slots')
  //     .where('orders.kitchenId = :kitchenId', { kitchenId: kitchenId })
  //     // .andWhere('orders.deliveryDate = :deliveryDate', {
  //     //   deliveryDate: deliveryDate,
  //     // })
  //     .groupBy('foods.name, time_slots.flag')
  //     .getMany();

  //   return list;
  // }
}
