import { MapInterceptor } from '@automapper/nestjs';
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
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleEnum } from 'src/common/enums/role.enum';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { CreatePackageItemDTO } from './dto/create-package-item.dto';
import { PackageItemDTO } from './dto/package-item.dto';
import { UpdatePackageItemDTO } from './dto/update-package-item';
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

  @Public()
  @Get('/:id')
  @ApiResponse({
    status: 200,
    description: 'GET PACKAGE ITEM BY ID',
    type: PackageItemDTO,
  })
  @UseInterceptors(MapInterceptor(PackageItemEntity, PackageItemDTO))
  async getPackageItemByID(
    @Param('id') id: string,
  ): Promise<PackageItemEntity> {
    const list = await this.packageItemService.findOne({
      where: { id: id },
      relations: { foodGroup: true, packages: true },
    });
    if (!list) {
      throw new HttpException(
        `Package item ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    } else {
      return list;
    }
  }

  @Public()
  @Post()
  @ApiResponse({
    status: 200,
    description: 'Create Package Item',
    type: PackageItemDTO,
  })
  async createPackageItem(
    @Body() createDTO: CreatePackageItemDTO,
  ): Promise<PackageItemEntity> {
    return await this.packageItemService.createPackageItem(createDTO);
  }

  @Roles(RoleEnum.MANAGER)
  @Put('/:id')
  @ApiResponse({
    status: 200,
    description: 'UPDATE PACKAGE ITEM',
    type: String,
  })
  async updatePackageItem(
    @Param('id') id: string,
    @Body() dto: UpdatePackageItemDTO,
  ): Promise<string> {
    return await this.packageItemService.updatePackageItem(id, dto);
  }

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
