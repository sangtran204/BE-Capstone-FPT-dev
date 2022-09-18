import {
  Body,
  Controller,
  Get,
  Param,
  Delete,
  Post,
  Put,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { StationPackageItemDTO } from './dto/stationPackageItem.dto';
import { StationPackageItemEntity } from './entiies/stationPackageItem.entity';
import { StationPackageItemService } from './stationPackageItem.service';

@ApiBearerAuth()
@ApiTags('stationPackageItem')
@Controller('stationPackageItem')
export class StationPackageItemController {
  constructor(
    private readonly stationPackageItemService: StationPackageItemService,
  ) {}

  //Get all stationPackageItem
  @Public()
  @Get()
  @ApiResponse({
    status: 200,
    description: 'GET ALL STATION PACKAGE ITEM',
    type: [StationPackageItemEntity],
  })
  async getAllStationPackageItem(): Promise<StationPackageItemEntity[]> {
    const list = await this.stationPackageItemService.getAllSationPackageItem();
    if (!list || list.length == 0) {
      throw new HttpException(
        'No data stationPackageItem',
        HttpStatus.NOT_FOUND,
      );
    } else {
      return list;
    }
  }

  //Get package by station
  @Public()
  @Get('/:stationId')
  @ApiResponse({
    status: 200,
    description: 'GET PACKAGE BY STATION',
    type: [StationPackageItemEntity],
  })
  async getPackageByStation(
    @Param('stationId') stationId: string,
  ): Promise<StationPackageItemEntity[]> {
    const list =
      await this.stationPackageItemService.getSationPackageItemByPackage(
        stationId,
      );
    if (!list) {
      throw new HttpException(
        'No package available for this station',
        HttpStatus.NOT_FOUND,
      );
    } else {
      return list;
    }
  }

  //Create stationPackageItem
  @Public()
  @Post()
  @ApiResponse({
    status: 200,
    description: 'CREATE STATION PACKAGE ITEM',
    type: String,
  })
  async createStationPackageItem(
    @Body() dto: StationPackageItemDTO,
  ): Promise<string> {
    return await this.stationPackageItemService.createStationPackageItem(dto);
  }

  //Delete station on package
  @Public()
  @Delete('/:id')
  @ApiResponse({
    status: 200,
    description: 'DELETE STATION PACKAGE ITEM',
    type: String,
  })
  async deleteStationOnPackage(@Param('id') id: string): Promise<string> {
    return this.stationPackageItemService.deleteStationOnPackage(id);
  }
}
