import { MapInterceptor } from '@automapper/nestjs';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RoleEnum } from 'src/common/enums/role.enum';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { CreateFoodDTO } from './dto/create-food.dto';
import {
  FoodFilter,
  FoodFilterDTO,
  FoodFindByPackage,
} from './dto/food-filter.dto';
import { FoodDTO } from './dto/food.dto';
import { UpdateFoodDTO } from './dto/update-food.dto';
import { FoodEntity } from './entities/foods.entity';
import { FoodsService } from './foods.service';

@ApiBearerAuth()
@ApiTags('foods')
@Controller('foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'GET ALL FOOD',
    type: [FoodDTO],
  })
  // @UseInterceptors(MapInterceptor(FoodEntity, FoodDTO, { isArray: true }))
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

  @Get('/food-onPackage')
  @Public()
  @ApiResponse({
    status: 200,
    description: 'GET ALL FOOD',
    type: [FoodDTO],
  })
  // @UseInterceptors(MapInterceptor(FoodEntity, FoodDTO, { isArray: true }))
  async findFoodOnPackage(
    @Query() find: FoodFindByPackage,
  ): Promise<FoodDTO[]> {
    return await this.foodsService.getFoodOnPackage(find);
  }

  @Get('/byCatefory_filter')
  @Public()
  @ApiResponse({
    status: 200,
    description: 'GET FOOD BY CATEGORY AND FILTER STATUS',
    type: [FoodDTO],
  })
  // @UseInterceptors(MapInterceptor(FoodEntity, FoodDTO, { isArray: true }))
  async findByCategoryFilter(
    @Query() filter: FoodFilter,
  ): Promise<FoodEntity[]> {
    return await this.foodsService.getFoodByCateFilter(filter);
  }

  @Get('/byStatus')
  @ApiResponse({
    status: 200,
    description: 'GET ALL FOOD BY STATUS',
    type: [FoodDTO],
  })
  // @UseInterceptors(MapInterceptor(FoodEntity, FoodDTO, { isArray: true }))
  async getFoodByStatus(
    @Query() foodFilter: FoodFilterDTO,
  ): Promise<FoodEntity[]> {
    const listFood = await this.foodsService.getFoodByStatus(foodFilter);
    if (!listFood || listFood.length == 0) {
      throw new HttpException(
        "Dont't have resource food",
        HttpStatus.NOT_FOUND,
      );
    }
    return listFood;
  }

  @Get('/:id')
  @ApiResponse({
    status: 200,
    description: 'GET FOOD BY ID',
    type: FoodDTO,
  })
  // @UseInterceptors(MapInterceptor(FoodEntity, FoodDTO))
  async findFoodById(@Param('id') id: string): Promise<FoodEntity> {
    const food = await this.foodsService.findOne({
      where: { id: id },
      relations: { foodCategory: true },
    });
    if (!food) {
      throw new HttpException(
        "Dont't have resource food",
        HttpStatus.NOT_FOUND,
      );
    }
    return food;
  }

  @Get('category/:id')
  @ApiResponse({
    status: 200,
    description: 'GET FOOD BY CATEGORY',
    type: [FoodDTO],
  })
  // @UseInterceptors(MapInterceptor(FoodEntity, FoodDTO, { isArray: true }))
  async findFoodByCategory(@Param('id') idCate: string): Promise<FoodEntity[]> {
    return await this.foodsService.getFoodByCategory(idCate);
  }

  @Post()
  @Roles(RoleEnum.MANAGER)
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'Create new food successfully',
    type: FoodDTO,
  })
  @UseInterceptors(MapInterceptor(FoodEntity, FoodDTO))
  async createFood(
    @Body() createFoodDTO: CreateFoodDTO,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<FoodEntity> {
    return await this.foodsService.createFood(createFoodDTO, image);
  }

  // Update
  @Put('/:id')
  @Roles(RoleEnum.MANAGER)
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'Update category successfully',
    type: String,
  })
  async updateFood(
    @Param('id') id: string,
    @Body() updateFood: UpdateFoodDTO,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<string> {
    return await this.foodsService.updateFood(id, updateFood, image);
  }

  // Remove Food = Update status
  @Put('/update-status/:id')
  @Roles(RoleEnum.MANAGER)
  @ApiResponse({
    status: 200,
    description: 'Update Food Status',
    type: String,
  })
  async updateStatusFood(@Param('id') id: string): Promise<string> {
    return await this.foodsService.updateStatusFood(id);
  }
}
