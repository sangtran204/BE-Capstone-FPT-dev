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
    if (listPackages != null) {
      return listPackages;
    } else {
      throw new HttpException('No data package', HttpStatus.NOT_FOUND);
    }
  }

  //Get package
  @Public()
  @Get('/:isActive')
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
    if (listPackages.length != 0) {
      return listPackages;
    } else {
      throw new HttpException('No data package', HttpStatus.NOT_FOUND);
    }
  }

  // Create package
  @Public()
  @Post()
  @ApiResponse({
    status: 200,
    description: 'CREATE PACKAGE',
    type: [PackageDTO],
  })
  @UseInterceptors(MapInterceptor(PackageEntity, PackageDTO))
  async createPackage(
    @Body() dto: PackageDTO,
  ): Promise<PackageEntity | { masage: string }> {
    const create = await this.packageService.createPackage(dto);
    if (create) {
      return { masage: 'Create package successfull' };
    } else {
      return { masage: 'Create package fail' };
    }
  }

  //Update package
  @Public()
  @Post('/update/:id')
  @ApiResponse({
    status: 200,
    description: 'UPDATE PACKAGE',
    type: [PackageDTO],
  })
  @UseInterceptors(MapInterceptor(PackageEntity, PackageDTO))
  async updatePackage(
    @Param('id') id: string,
    @Body() dto: PackageDTO,
  ): Promise<PackageEntity | { masage: string }> {
    const create = await this.packageService.updatePackage(id, dto);
    if (create) {
      return { masage: 'Update successfull' };
    } else {
      return { masage: 'Update fail' };
    }
  }

  //Update package status
  @Public()
  @Put('/:id')
  @ApiResponse({
    status: 200,
    description: 'UPDATE PACKAGE STATUS',
    type: [PackageDTO],
  })
  @UseInterceptors(MapInterceptor(PackageEntity, PackageDTO))
  async updatePackageStatus(
    @Param('id') id: string,
  ): Promise<{ massage: string }> {
    if (await this.packageService.updateStatus(id)) {
      return { massage: 'Package active' };
    } else {
      return { massage: 'Package inActive' };
    }
  }

  //Delete package
  @Public()
  @Delete('/:id')
  @ApiResponse({
    status: 200,
    description: 'DELETE PACKAGE',
    type: [PackageDTO],
  })
  @UseInterceptors(MapInterceptor(PackageEntity, PackageDTO))
  async deletePackage(@Param('id') id: string): Promise<{ massage: string }> {
    if (await this.packageService.deletePackage(id)) {
      return { massage: 'Delete successfull' };
    } else {
      return { massage: 'Delete fail' };
    }
  }
}
