import { MapInterceptor } from '@automapper/nestjs';
import {
  Body,
  Controller,
  UploadedFile,
  Get,
  Param,
  Post,
  Put,
  Delete,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RoleEnum } from 'src/common/enums/role.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { CreatePackageCategoryDTO } from './dto/create-package-category';
import { PackageCategoryDTO } from './dto/package-category.dto';
import { UpdatePackageCategoryDTO } from './dto/update-package-category';
import { PackageCategoryEntity } from './entities/package-categories.entity';
import { PackageCategoriesService } from './package-categories.service';

@ApiBearerAuth()
@ApiTags('package-categories')
@Controller('package-categories')
export class PackgeCategoriesController {
  constructor(
    private readonly packageCategoriesService: PackageCategoriesService,
  ) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'GET ALL PACKAGE CATEGORY',
    type: [PackageCategoryDTO],
  })
  @UseInterceptors(
    MapInterceptor(PackageCategoryEntity, PackageCategoryDTO, {
      isArray: true,
    }),
  )
  async findAll(): Promise<PackageCategoryEntity[]> {
    const listPackageCategories =
      await this.packageCategoriesService.getAllPackageCategories();
    if (!listPackageCategories || listPackageCategories.length == 0) {
      throw new HttpException("Don't have resourse", HttpStatus.NOT_FOUND);
    }
    return listPackageCategories;
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'CREATE NEW CATEGORY SUCCESSFULLY',
    type: PackageCategoryDTO,
  })
  @UseInterceptors(MapInterceptor(PackageCategoryEntity, PackageCategoryDTO))
  async createCategory(
    @Body() createPackageCategory: CreatePackageCategoryDTO,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<PackageCategoryEntity> {
    return await this.packageCategoriesService.createPackageCategories(
      createPackageCategory.name,
      image,
    );
  }

  @Get('/hasPackage')
  @ApiResponse({
    status: 200,
    description: 'GET CATEGORY PACKAGE ACTIVE',
    type: PackageCategoryDTO,
  })
  @UseInterceptors(
    MapInterceptor(PackageCategoryEntity, PackageCategoryDTO, {
      isArray: true,
    }),
  )
  async getCategoryHasPackageActive(): Promise<PackageCategoryEntity[]> {
    return await this.packageCategoriesService.getCategoryHasPackageActive();
  }

  @Put('/:id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'Update package category successfully',
    type: String,
  })
  async updatePackageCategory(
    @Param('id') id: string,
    @Body() update: UpdatePackageCategoryDTO,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<string> {
    return await this.packageCategoriesService.updatePackageCategory(
      id,
      update.name,
      image,
    );
  }
  @Delete('/:id')
  @Roles(RoleEnum.MANAGER)
  @ApiResponse({
    status: 200,
    description: 'Delete Category by Id',
    type: String,
  })
  async removeCategory(@Param('id') id: string): Promise<string> {
    return await this.packageCategoriesService.deletePackageCategory(id);
  }
}
