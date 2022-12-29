import { Like, Repository } from 'typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../base/base.service';
import { FoodEntity } from './entities/foods.entity';
import { FoodCategoriesService } from '../food-categories/food-categories.service';
import { CreateFoodDTO } from './dto/create-food.dto';
import { UpdateFoodDTO } from './dto/update-food.dto';
import { StatusEnum } from 'src/common/enums/status.enum';
import {
  FoodFilter,
  FoodFilterDTO,
  FoodFindByPackage,
} from './dto/food-filter.dto';
import { FoodDTO } from './dto/food.dto';

@Injectable()
export class FoodsService extends BaseService<FoodEntity> {
  constructor(
    @InjectRepository(FoodEntity)
    private readonly foodsRepository: Repository<FoodEntity>,
    private readonly foodCategoryService: FoodCategoriesService,
  ) {
    super(foodsRepository);
  }

  async getFoodOnPackage(id: FoodFindByPackage): Promise<FoodDTO[]> {
    const list = await this.foodsRepository
      .createQueryBuilder('foods')
      .select('foods.id, foods.name, foods.image')
      .leftJoin('foods.foodGroups', 'food_groups')
      .leftJoin('food_groups.packageItem', 'package_item')
      .leftJoin('package_item.packages', 'packages')
      .where('packages.id = :id', { id: id.packageId })
      .groupBy('foods.id, foods.name, foods.image')
      .execute();

    if (!list || list.length == 0) {
      throw new HttpException('No food found!', HttpStatus.NOT_FOUND);
    }
    return list;
  }

  async getAllFood(): Promise<FoodEntity[]> {
    return await this.foodsRepository.find({
      relations: {
        foodCategory: true,
      },
    });
  }

  async getFoodByStatus(foodFilter: FoodFilterDTO): Promise<FoodEntity[]> {
    const { statusFood } = foodFilter;
    return await this.foodsRepository.find({
      where: {
        status: Like(Boolean(statusFood) ? statusFood : '%%'),
      },
      relations: {
        foodCategory: true,
      },
    });
  }

  async getFoodByCateFilter(filter: FoodFilter): Promise<FoodEntity[]> {
    const { status } = filter;
    const cate = await this.foodCategoryService.findOne({
      where: { id: filter.categoryId },
    });
    if (!cate) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    const foods = await this.foodsRepository.find({
      where: {
        foodCategory: { id: filter.categoryId },
        status: Like(Boolean(status) ? status : '%%'),
      },
      relations: {
        foodCategory: true,
      },
    });

    if (!foods || foods.length == 0) {
      throw new HttpException('No food found', HttpStatus.NOT_FOUND);
    } else {
      return foods;
    }
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
}
