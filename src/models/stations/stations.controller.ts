import { MapInterceptor } from '@automapper/nestjs';
import {
  Body,
  Controller,
  Delete,
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

// const dateNow = new Date(Date.now()).toLocaleString();

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

  //Insert station

  @Public()
  @Post()
  @ApiResponse({
    status: 200,
    description: 'Created new station successfully',
    type: StationDTO,
  })
  @UseInterceptors(MapInterceptor(StationEntity, StationDTO))
  async createStation(@Body() dto: StationDTO): Promise<StationEntity> {
    return await this.stationsService.save({
      name: dto.name,
      address: dto.address,
      phone: dto.phone,
      openTime: dto.openTime,
      closeTime: dto.closeTime,
    });
  }

  //Delete station
  @Public()
  @Put('/:id')
  @ApiResponse({
    status: 200,
    description: 'Deleted station successfully',
    type: boolean,
  })
  @UseInterceptors(MapInterceptor(StationEntity, StationDTO))
  async deleteStation(@Param('id') id: string): Promise<boolean> {
    return await this.stationsService.deleteStation(id);
  }

  //Update station
  @Public()
  @Post('/:id')
  @ApiResponse({
    status: 200,
    description: 'Updated station successfully',
    type: boolean,
  })
  @UseInterceptors(MapInterceptor(StationEntity, StationDTO))
  async updateStation(
    @Param('id') id: string,
    @Body() dto: StationDTO,
  ): Promise<boolean> {
    return await this.stationsService.updateStation(id, dto);
  }

  //Search station
  @Public()
  @Get('/:id')
  @ApiResponse({
    status: 200,
    description: 'Search station successfully',
    type: StationDTO,
  })
  @UseInterceptors(MapInterceptor(StationEntity, StationDTO))
  async findById(@Param('id') id: string): Promise<StationEntity> {
    return await this.stationsService.findOne({ where: { id: id } });
  }
}
