import { MapInterceptor } from '@automapper/nestjs';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { FoodDTO } from './dto/food.dto';
import { FoodEntity } from './entities/foods.entity';
import { FoodsService } from './foods.service';

@ApiBearerAuth()
@ApiTags('foods')
@Controller('foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Public()
  @Get()
  @ApiResponse({
    status: 200,
    description: 'GET ALL FOOD',
    type: [FoodDTO],
  })
  async findAll(): Promise<FoodEntity[]> {
    const listFood = await this.foodsService.getAllFood();
    if (!listFood || listFood.length == 0) {
      throw new HttpException(
        "Dont't have resource food",
        HttpStatus.NOT_FOUND,
      );
    }
    return listFood;
  }

  @Public()
  @Get('/getAllActiveFood')
  @ApiResponse({
    status: 200,
    description: 'GET ALL ACTIVE FOOD',
    type: [FoodDTO],
  })
  async findAllActiveFood(): Promise<FoodEntity[]> {
    const listFood = await this.foodsService.getAllActiveFood();
    if (!listFood || listFood.length == 0) {
      throw new HttpException(
        "Dont't have resource active food",
        HttpStatus.NOT_FOUND,
      );
    }
    return listFood;
  }

  @Public()
  @Post()
  @ApiResponse({
    status: 200,
    description: 'Create food successfully',
    type: FoodDTO,
  })
  @UseInterceptors(MapInterceptor(FoodEntity, FoodDTO))
  async createFood(@Body() dto: FoodDTO): Promise<FoodEntity> {
    return await this.foodsService.save({ name: dto.name });
  }
}
