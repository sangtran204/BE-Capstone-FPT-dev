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

  //Get package
  @Public()
  @Get('/:isActive')
  @ApiResponse({
    status: 200,
    description: 'GET PACKAGE',
    type: [PackageDTO],
  })
  @UseInterceptors(MapInterceptor(PackageEntity, PackageDTO))
  async getPackage(
    @Param('isActive') isActive: string,
  ): Promise<PackageEntity[] | string> {
    const listPackages = await this.packageService.listAllPackage(isActive);
    if (listPackages.length != 0) {
      return listPackages;
    } else {
      return 'No data package';
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
  ): Promise<PackageEntity | string> {
    const create = await this.packageService.createPackage(dto);
    if (create) {
      return 'Create package successfull';
    } else {
      return 'Create package fail';
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
  ): Promise<PackageEntity | string> {
    const create = await this.packageService.updatePackage(id, dto);
    if (create) {
      return 'Update successfull';
    } else {
      return 'Update fail';
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
  async updatePackageStatus(@Param('id') id: string): Promise<string> {
    if (await this.packageService.updateStatus(id)) {
      return 'Active';
    } else {
      return 'InActive';
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
  async deletePackage(@Param('id') id: string): Promise<string> {
    if (await this.packageService.deletePackage(id)) {
      return 'Delete successfull';
    } else {
      return 'Delete fail';
    }
  }
}
