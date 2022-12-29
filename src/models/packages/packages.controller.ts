import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Param,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
  ApiConsumes,
} from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { PackageService } from './packages.service';
import { PackageDTO } from './dto/packages.dto';
import { PackageEntity } from './entities/packages.entity';
import { CreatePackageDTO } from './dto/create-package.dto';
import { MapInterceptor } from '@automapper/nestjs';
import { Roles } from 'src/decorators/roles.decorator';
import { RoleEnum } from 'src/common/enums/role.enum';
import { UpdatePackageDTO } from './dto/update-package.dto';
import { PackageFilterDTO } from './dto/package-filter.dto';

@ApiBearerAuth()
@ApiTags('packages')
@Controller('packages')
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  //Get all package
  @Get()
  @ApiResponse({
    status: 200,
    description: 'GET ALL PACKAGE',
    type: [PackageEntity],
  })
  // @UseInterceptors(MapInterceptor(PackageEntity, PackageDTO, { isArray: true }))
  async getAllPackage(): Promise<PackageEntity[]> {
    const listPackages = await this.packageService.listAllPackage();
    if (!listPackages || listPackages.length == 0) {
      throw new HttpException('No data package', HttpStatus.NOT_FOUND);
    }
    return listPackages;
  }

  @Get('/byStatus')
  @ApiResponse({
    status: 200,
    description: 'GET PACKAGE BY STATUS',
    type: [PackageEntity],
  })
  // @UseInterceptors(MapInterceptor(PackageEntity, PackageDTO, { isArray: true }))
  async getPackageByStatus(
    @Query() packageFilter: PackageFilterDTO,
  ): Promise<PackageEntity[]> {
    const listPackages = await this.packageService.getPackageByStatus(
      packageFilter,
    );
    if (!listPackages || listPackages.length == 0) {
      throw new HttpException('No data package', HttpStatus.NOT_FOUND);
    }
    return listPackages;
  }

  @Get('find/:id')
  @ApiResponse({
    status: 200,
    description: 'GET PACKAGE BY ID',
    type: PackageEntity,
  })
  // @UseInterceptors(MapInterceptor(PackageEntity, PackageDTO))
  async getPackageByID(@Param('id') id: string): Promise<PackageEntity> {
    const packageRes = await this.packageService.findOne({
      where: { id: id },
      relations: {
        packageCategory: true,
        packageItem: { foodGroup: true },
      },
    });
    if (!packageRes) {
      throw new HttpException("Dont't have resource", HttpStatus.NOT_FOUND);
    }
    return packageRes;
  }

  @Get('item/:id')
  @ApiResponse({
    status: 200,
    description: 'GET Package Item BY ID PACKAGE',
    type: PackageDTO,
  })
  @UseInterceptors(MapInterceptor(PackageEntity, PackageDTO))
  async findItemOfPackage(@Param('id') id: string): Promise<PackageEntity> {
    const item = await this.packageService.findOne({
      where: { id: id },
      relations: { packageItem: true },
    });
    if (!item) {
      throw new HttpException(
        "Dont't have resource PackageItem",
        HttpStatus.NOT_FOUND,
      );
    }
    return item;
  }

  // Create package
  @Roles(RoleEnum.MANAGER)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'CREATE PACKAGE',
    type: PackageDTO,
  })
  @UseInterceptors(MapInterceptor(PackageEntity, PackageDTO))
  async createPackage(
    @Body() createData: CreatePackageDTO,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<PackageEntity> {
    return await this.packageService.createPackage(createData, image);
  }

  //Update package
  @Roles(RoleEnum.MANAGER)
  @Put('/update/:id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'UPDATE PACKAGE',
    type: String,
  })
  async updatePackage(
    @Param('id') id: string,
    @Body() data: UpdatePackageDTO,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<string> {
    return await this.packageService.updatePackage(id, data, image);
  }

  //Update package status
  // @Public()
  // @Roles(RoleEnum.ADMIN)
  @Put('/confirm/:id')
  @ApiResponse({
    status: 200,
    description: 'CONFIRM PACKAGE STATUS',
    type: String,
  })
  async confirmPackage(@Param('id') id: string): Promise<string> {
    return await this.packageService.confirmPackage(id);
  }

  //Delete package
  // @Public()
  // @Delete('/:id')
  // @ApiResponse({
  //   status: 200,
  //   description: 'DELETE PACKAGE',
  //   type: String,
  // })
  // async deletePackage(@Param('id') id: string): Promise<string> {
  //   return await this.packageService.deletePackage(id);
  // }

  @Public()
  @Get('/byCategory/:categoryId')
  @ApiResponse({
    status: 200,
    description: 'GET ACTIVE PACKAGE BY CATEGORY',
    type: [PackageEntity],
  })
  async getPackageActiveByCate(
    @Param('categoryId') categoryId: string,
  ): Promise<PackageEntity[]> {
    return await this.packageService.getActivePackageByCategory(categoryId);
  }
}
