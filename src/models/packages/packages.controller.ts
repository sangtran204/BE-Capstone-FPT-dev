import { MapInterceptor } from '@automapper/nestjs';
import {
  Body,
  Controller,
  Get,
  Param,
  Delete,
  Post,
  Put,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { PackageService } from './packages.service';
import { PackageDTO } from './dto/packages.dto';
import { PackageEntity } from './entities/packages.entity';

@ApiBearerAuth()
@ApiTags('packages')
@Controller('packages')
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  //Get all package
  @Public()
  @Get()
  @ApiResponse({
    status: 200,
    description: 'GET ALL PACKAGE',
    type: [PackageDTO],
  })
  @UseInterceptors(MapInterceptor(PackageEntity, PackageDTO))
  async getAllPackage(): Promise<PackageEntity[] | string> {
    const listPackages = await this.packageService.listAllPackage();
    if (!listPackages || listPackages.length == 0) {
      throw new HttpException('No data package', HttpStatus.NOT_FOUND);
    }
    return listPackages;
  }

  //Get package
  @Public()
  @Get('/findByIsActive/:isActive')
  @ApiResponse({
    status: 200,
    description: 'GET PACKAGE FOLLOW STATUS',
    type: [PackageDTO],
  })
  @UseInterceptors(MapInterceptor(PackageEntity, PackageDTO))
  async getPackage(
    @Param('isActive') isActive: string,
  ): Promise<PackageEntity[] | string> {
    const listPackages = await this.packageService.listPackageStatus(isActive);
    if (!listPackages || listPackages.length == 0) {
      throw new HttpException('No data package', HttpStatus.NOT_FOUND);
    }
    return listPackages;
  }

  // Create package
  @Public()
  @Post()
  @ApiResponse({
    status: 200,
    description: 'CREATE PACKAGE',
    type: PackageDTO,
  })
  @UseInterceptors(MapInterceptor(PackageEntity, PackageDTO))
  async createPackage(
    @Body() dto: PackageDTO,
  ): Promise<PackageEntity | { message: string }> {
    const create = await this.packageService.createPackage(dto);
    if (create) {
      return { message: 'Create package successfull' };
    } else {
      return { message: 'Create package fail' };
    }
  }

  //Update package
  @Public()
  @Post('/update/:id')
  @ApiResponse({
    status: 200,
    description: 'UPDATE PACKAGE',
    type: PackageDTO,
  })
  @UseInterceptors(MapInterceptor(PackageEntity, PackageDTO))
  async updatePackage(
    @Param('id') id: string,
    @Body() dto: PackageDTO,
  ): Promise<string> {
    return await this.packageService.updatePackage(id, dto);
  }

  //Update package status
  @Public()
  @Put('/updateStatus/:id')
  @ApiResponse({
    status: 200,
    description: 'UPDATE PACKAGE STATUS',
    type: PackageDTO,
  })
  @UseInterceptors(MapInterceptor(PackageEntity, PackageDTO))
  async updatePackageStatus(@Param('id') id: string): Promise<string> {
    if (await this.packageService.updateStatus(id)) {
      return 'Package active';
    } else {
      return 'Package inActive';
    }
  }

  //Delete package
  @Public()
  @Delete('/:id')
  @ApiResponse({
    status: 200,
    description: 'DELETE PACKAGE',
    type: String,
  })
  @UseInterceptors(MapInterceptor(PackageEntity, PackageDTO))
  async deletePackage(@Param('id') id: string): Promise<string> {
    return await this.packageService.deletePackage(id);
  }
}
