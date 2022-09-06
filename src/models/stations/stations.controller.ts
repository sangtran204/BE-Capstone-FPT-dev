import { MapInterceptor } from '@automapper/nestjs';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { StationEntity } from './entities/stations.entity';
import { StationDTO } from './dto/stations.dto';
import { StationsService } from './stations.service';
import { boolean } from 'joi';

@ApiBearerAuth()
@ApiTags('stations')
@Controller('stations')
export class StationsController {
  constructor(private readonly stationsService: StationsService) {}

  //Find all station
  @Public()
  @Get()
  @ApiResponse({
    status: 200,
    description: 'GET ALL STATION',
    type: [StationDTO],
  })
  @UseInterceptors(
    MapInterceptor(StationDTO, StationEntity, {
      isArray: true,
    }),
  )
  async findAll(): Promise<StationEntity[] | { message: string }> {
    const listStation = await this.stationsService.getStations();
    if (listStation.length == 0) {
      return { message: 'No Station found' };
    }
    return listStation;
  }

  //Find ALL ACTIVE STATION
  @Public()
  @Get('/getAllActiveStation')
  @ApiResponse({
    status: 200,
    description: 'GET ALL STATION',
    type: [StationDTO],
  })
  @UseInterceptors(
    MapInterceptor(StationDTO, StationEntity, {
      isArray: true,
    }),
  )
  async findAllActiveStation(): Promise<StationEntity[] | { message: string }> {
    const listStation = await this.stationsService.getAllActiveStations();
    if (listStation.length == 0) {
      return { message: 'No Station found' };
    }
    return listStation;
  }

  //Insert station
  @Public()
  @Post()
  @ApiResponse({
    status: 200,
    description: 'CREATE STATION',
    type: StationDTO,
  })
  @UseInterceptors(MapInterceptor(StationEntity, StationDTO))
  async createStation(@Body() dto: StationDTO): Promise<string> {
    if (await this.stationsService.createStation(dto)) {
      return 'Create station successfull';
    } else {
      return 'Create station fail';
    }
  }

  //Delete station
  @Public()
  @Put('/removeStation/:id')
  @ApiResponse({
    status: 200,
    description: 'DELETE STATION',
    type: boolean,
  })
  @UseInterceptors(MapInterceptor(StationEntity, StationDTO))
  async deleteStation(@Param('id') id: string): Promise<string> {
    if (await this.stationsService.deleteStation(id)) {
      return 'Delete successfull';
    } else {
      return 'Delete fail';
    }
  }

  //Update station
  @Public()
  @Post('/:id')
  @ApiResponse({
    status: 200,
    description: 'UPDATE STATION',
    type: boolean,
  })
  @UseInterceptors(MapInterceptor(StationEntity, StationDTO))
  async updateStation(
    @Param('id') id: string,
    @Body() dto: StationDTO,
  ): Promise<string> {
    if (await this.stationsService.updateStation(id, dto)) {
      return 'Update successfull';
    } else {
      return 'Update fail';
    }
  }

  //Find Station By Id
  @Public()
  @Get('/:id')
  @ApiResponse({
    status: 200,
    description: 'FIND STATION BY ID',
    type: StationDTO,
  })
  @UseInterceptors(MapInterceptor(StationEntity, StationDTO))
  async findById(@Param('id') id: string): Promise<StationEntity | string> {
    const station = await this.stationsService.findOne({ where: { id: id } });
    if (station != null) {
      return station;
    } else {
      return `${id} not found`;
    }
  }
}
