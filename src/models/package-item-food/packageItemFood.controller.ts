import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Delete,
  Put,
  Param,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { PackageItemFoodDTO } from './dto/packageItemFood.dto';
import { PackageItemFoodEntity } from './entities/packageItemFood.entity';
import { PackageItemFoodService } from './packageItemFood.service';

@ApiBearerAuth()
@ApiTags('packageItemFood')
@Controller('packageItemFood')
export class PackageItemFoodController {
  constructor(
    private readonly packageItemFoodService: PackageItemFoodService,
  ) {}

  //Get all package item food.
  @Public()
  @Get()
  @ApiResponse({
    status: 200,
    description: 'GET ALL PACKAGE ITEM FOOD',
    type: [PackageItemFoodEntity],
  })
  async getAllPackageItemFood(): Promise<PackageItemFoodEntity[]> {
    const list = await this.packageItemFoodService.getAllPackageItemFood();
    if (!list || list.length == 0) {
      throw new HttpException(
        'No data package item food',
        HttpStatus.NOT_FOUND,
      );
    } else {
      return list;
    }
  }

  //Update package item food
  @Public()
  @Put('/:id')
  @ApiResponse({
    status: 200,
    description: 'UPDATE PACKAGE ITEM FOOD',
    type: String,
  })
  async updatePackageItemFood(
    @Param('id') id: string,
    @Body() dto: PackageItemFoodDTO,
  ): Promise<string> {
    return await this.packageItemFoodService.updatePackageItemFood(id, dto);
  }

  //Delete package item food
  @Public()
  @Delete('/:id')
  @ApiResponse({
    status: 200,
    description: 'DELETE PACKAGE ITEM FOOD',
    type: String,
  })
  async deletePackageItemFood(@Param('id') id: string): Promise<string> {
    return await this.packageItemFoodService.deletePackageItemFood(id);
  }
}
