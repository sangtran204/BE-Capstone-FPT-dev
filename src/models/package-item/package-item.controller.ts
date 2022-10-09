import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Delete,
  Put,
  Param,
  Body,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { CreatePackageItemDTO } from './dto/create-package-item.dto';
import { PackageItemDTO } from './dto/package-item.dto';
import { PackageItemEntity } from './entities/package-item.entity';
import { PackageItemService } from './package-item.service';

@ApiBearerAuth()
@ApiTags('package-item')
@Controller('package-item')
export class PackageItemController {
  constructor(private readonly packageItemService: PackageItemService) {}

  @Public()
  @Get()
  @ApiResponse({
    status: 200,
    description: 'GET ALL PACKAGE ITEM',
    type: [PackageItemDTO],
  })
  async getAllPackageItem(): Promise<PackageItemEntity[]> {
    const list = await this.packageItemService.getAllPackageItem();
    if (!list || list.length == 0) {
      throw new HttpException('No data package item', HttpStatus.NOT_FOUND);
    } else {
      return list;
    }
  }

  // @Public()
  // @Post()
  // @ApiResponse({
  //   status: 200,
  //   description: 'Create Package Item',
  //   type: PackageItemDTO,
  // })
  // async createPackageItem(
  //   @Body() createDTO: CreatePackageItemDTO,
  // ): Promise<PackageItemEntity> {
  //   return await this.packageItemService.createPackageItem(createDTO);
  // }

  // ==============================================================================
  //NEED Review Again

  //Update package item
  // @Public()
  // @Put('/:id')
  // @ApiOkResponse({
  //   status: 200,
  //   description: 'UPDATE PACKAGE ITEM',
  //   type: String,
  // })
  // async updatePackageItem(
  //   @Param('id') id: string,
  //   @Body() dto: PackageItemDTO,
  // ): Promise<string> {
  //   return await this.packageItemService.updatePackageItem(id, dto);
  // }

  //Delete package item
  // @Public()
  // @Delete('/:id')
  // @ApiResponse({
  //   status: 200,
  //   description: 'DELETE PACKAGE ITEM',
  //   type: String,
  // })
  // async deletePackageItem(@Param('id') id: string): Promise<string> {
  //   return this.packageItemService.deletePackageItem(id);
  // }

  // ==============================================================================
}
