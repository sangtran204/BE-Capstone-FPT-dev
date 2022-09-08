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
import { CategoriesService } from './categories.service';
import { CategoryDTO } from './dto/category.dto';
import { CategoryEntity } from './entities/categories.entity';

@ApiBearerAuth()
@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Get()
  @ApiResponse({
    status: 200,
    description: 'GET ALL CATEGORY',
    type: [CategoryDTO],
  })
  async findAll(): Promise<CategoryEntity[]> {
    const listCategory = await this.categoriesService.getCategories();
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
    type: CategoryDTO,
  })
  @UseInterceptors(MapInterceptor(CategoryEntity, CategoryDTO))
  async findCategoryById(@Param('id') id: string): Promise<CategoryEntity> {
    const category = await this.categoriesService.findOne({
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
    type: CategoryDTO,
  })
  @UseInterceptors(MapInterceptor(CategoryEntity, CategoryDTO))
  async createCategory(@Body() dto: CategoryDTO): Promise<CategoryEntity> {
    return await this.categoriesService.save({ name: dto.name });
  }

  @Put('/:id')
  @Public()
  @UseInterceptors(MapInterceptor(CategoryEntity, CategoryDTO))
  async updateCategory(
    @Param('id') id: string,
    @Body() dto: CategoryDTO,
  ): Promise<string> {
    // return await this.categoriesService.save({ id: id, name: dto.name });
    return await this.categoriesService.updateCategory(id, dto);
  }

  @Delete('/:id')
  @ApiResponse({
    status: 200,
    description: 'Delete a Category by Id',
    type: String,
  })
  async removeCategory(@Param('id') id: string): Promise<string> {
    return await this.categoriesService.deleteCategoryById(id);
  }
}
