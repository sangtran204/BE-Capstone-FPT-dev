import { MapInterceptor } from '@automapper/nestjs';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { StationEntity } from './entities/stations.entity';
import { StationDTO } from './dto/stations.dto';
import { StationsService } from './stations.service';

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
  async findAll(): Promise<StationEntity[] | string> {
    const listStation = await this.stationsService.getStations();
    if (listStation.length == 0) {
      throw new HttpException('No data station', HttpStatus.NOT_FOUND);
    }
    return listStation;
  }

  //Find ALL ACTIVE STATION
  @Public()
  @Get('/getAllActiveStation')
  @ApiResponse({
    status: 200,
    description: 'GET ALL STATION ACTIVE',
    type: [StationDTO],
  })
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
  async createStation(@Body() dto: StationDTO): Promise<StationEntity> {
    return this.stationsService.createStation(dto);
  }

  //Delete station
  @Public()
  @Put('/removeStation/:id')
  @ApiResponse({
    status: 200,
    description: 'DELETE STATION',
    type: StationDTO,
  })
  @UseInterceptors(MapInterceptor(StationEntity, StationDTO))
  async deleteStation(@Param('id') id: string): Promise<string> {
    return await this.stationsService.deleteStation(id);
  }

  //Update station
  @Public()
  @Post('/:id')
  @ApiResponse({
    status: 200,
    description: 'UPDATE STATION',
    type: String,
  })
  // @UseInterceptors(MapInterceptor(StationEntity, StationDTO))
  async updateStation(
    @Param('id') id: string,
    @Body() dto: StationDTO,
  ): Promise<string> {
    return this.stationsService.updateStation(id, dto);
  }
}
