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

  // Find All Category
  @Public()
  @Get()
  @ApiResponse({
    status: 200,
    description: 'GET ALL CATEGORY',
    type: [CategoryDTO],
  })
  @UseInterceptors(
    MapInterceptor(CategoryEntity, CategoryDTO, {
      isArray: true,
    }),
  )
  async findAll(): Promise<CategoryEntity[] | { message: string }> {
    const listCategory = await this.categoriesService.getCategories();
    if (listCategory.length == 0) {
      return { message: 'No Data Category' };
    }
    return listCategory;
  }

  // Create New Category
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

  // Find By ID
  @Public()
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Get detail Category by ID',
    type: CategoryDTO,
  })
  @UseInterceptors(MapInterceptor(CategoryEntity, CategoryDTO))
  async findOne(@Param('id') id: string): Promise<CategoryEntity> {
    return await this.categoriesService.findOne({ where: { id: id } });
  }

  //Got bug========================================================================================

  //   @UseInterceptors(MapInterceptor(CategoryEntity, CategoryDTO))
  //   @Put('/:id')
  //   @Public()
  //   async updateCategory(
  //     @Param('id') id: string,
  //     @Body() dto: CategoryDTO,
  //   ): Promise<CategoryEntity> {
  //     // return await this.categoriesService.save({ id: id, name: dto.name });
  //     return await this.categoriesService.updateCate({ id: id, dto });
  //   }

  // @Delete('/:id')
  // @ApiResponse({
  //   status: 200,
  //   description: 'Delete a Category by Id',
  //   type: String,
  // })
  // async remove(@Param('id') id: string): Promise<string> {
  //   return await this.categoriesService.deleteCategoryById(id);
  // }

  // ==============================================================================================
}
