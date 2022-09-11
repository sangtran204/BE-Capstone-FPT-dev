import { MapInterceptor } from '@automapper/nestjs';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { FoodCategoryDTO } from './dto/food-category.dto';
import { FoodCategoryEntity } from './entities/food-categories.entity';
import { FoodCategoriesService } from './food-categories.service';

@ApiBearerAuth()
@ApiTags('categories')
@Controller('categories')
export class FoodCategoriesController {
  constructor(private readonly foodCategoriesService: FoodCategoriesService) {}

  @Public()
  @Get()
  @ApiResponse({
    status: 200,
    description: 'GET ALL CATEGORY',
    type: [FoodCategoryDTO],
  })
  async findAll(): Promise<FoodCategoryEntity[]> {
    const listCategory = await this.foodCategoriesService.getCategories();
    if (!listCategory || listCategory.length == 0) {
      throw new HttpException("Dont't have resource", HttpStatus.NOT_FOUND);
    }
    return listCategory;
  }

  @Public()
  @Get('/:id')
  @ApiResponse({
    status: 200,
    description: 'Get detail Category by ID',
    type: FoodCategoryDTO,
  })
  @UseInterceptors(MapInterceptor(FoodCategoryEntity, FoodCategoryDTO))
  async findCategoryById(@Param('id') id: string): Promise<FoodCategoryEntity> {
    const category = await this.foodCategoriesService.findOne({
      where: { id: id },
    });
    if (!category)
      throw new HttpException("Dont't have resource", HttpStatus.NOT_FOUND);
    return category;
  }

  @Post()
  @Public()
  @ApiResponse({
    status: 200,
    description: 'Created new category successfully',
    type: FoodCategoryDTO,
  })
  @UseInterceptors(MapInterceptor(FoodCategoryEntity, FoodCategoryDTO))
  async createCategory(
    @Body() dto: FoodCategoryDTO,
  ): Promise<FoodCategoryEntity> {
    return await this.foodCategoriesService.save({ name: dto.name });
  }

  @Put('/:id')
  @Public()
  @UseInterceptors(MapInterceptor(FoodCategoryEntity, FoodCategoryDTO))
  async updateCategory(
    @Param('id') id: string,
    @Body() dto: FoodCategoryDTO,
  ): Promise<string> {
    // return await this.categoriesService.save({ id: id, name: dto.name });
    return await this.foodCategoriesService.updateCategory(id, dto);
  }

  @Delete('/:id')
  @ApiResponse({
    status: 200,
    description: 'Delete a Category by Id',
    type: String,
  })
  async removeCategory(@Param('id') id: string): Promise<string> {
    return await this.foodCategoriesService.deleteCategoryById(id);
  }
}
