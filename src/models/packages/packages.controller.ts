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
import { StatusEnum } from 'src/common/enums/status.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { RoleEnum } from 'src/common/enums/role.enum';
import { UpdatePackageDTO } from './dto/update-package.dto';

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
  async getAllPackage(): Promise<PackageEntity[]> {
    const listPackages = await this.packageService.listAllPackage();
    if (!listPackages || listPackages.length == 0) {
      throw new HttpException('No data package', HttpStatus.NOT_FOUND);
    }
    return listPackages;
  }

  @Public()
  @Get('find-by-id/:id')
  @ApiResponse({
    status: 200,
    description: 'GET PACKAGE BY ID',
    type: PackageDTO,
  })
  async getPackageByID(@Param('id') id: string): Promise<PackageEntity> {
    const packageRes = await this.packageService.findOne({
      where: { id: id },
      relations: {
        timeFrame: true,
      },
    });
    if (!packageRes) {
      throw new HttpException("Dont't have resource", HttpStatus.NOT_FOUND);
    }
    return packageRes;
  }

  //Get package
  @Public()
  @Get('/waiting')
  @ApiResponse({
    status: 200,
    description: 'GET WAITING PACKAGE',
    type: [PackageDTO],
  })
  async getPackageWaiting(): Promise<PackageEntity[]> {
    const listPackages = await this.packageService.query({
      where: { status: StatusEnum.WAITING },
      relations: {
        timeFrame: true,
      },
    });
    if (!listPackages || listPackages.length == 0) {
      throw new HttpException(
        "Dont't have resource waiting",
        HttpStatus.NOT_FOUND,
      );
    }
    return listPackages;
  }

  @Public()
  @Get('/active')
  @ApiResponse({
    status: 200,
    description: 'GET ACTIVE PACKAGE',
    type: [PackageDTO],
  })
  async getPackageActive(): Promise<PackageEntity[]> {
    const listPackages = await this.packageService.query({
      where: { status: StatusEnum.ACTIVE },
      relations: {
        timeFrame: true,
      },
    });
    if (!listPackages || listPackages.length == 0) {
      throw new HttpException(
        "Dont't have resource Active",
        HttpStatus.NOT_FOUND,
      );
    }
    return listPackages;
  }

  // Create package
  @Public()
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
  // @Public()
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
  @Roles(RoleEnum.ADMIN)
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
}
