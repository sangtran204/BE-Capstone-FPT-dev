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
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StationEntity } from './entities/stations.entity';
import { StationDTO } from './dto/stations.dto';
import { StationsService } from './stations.service';
import { CreateStationDTO } from './dto/create-station.dto';
import { UpdateStationDTO } from './dto/update-station.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { RoleEnum } from 'src/common/enums/role.enum';
import {
  StationByKitchenId,
  StationStatusFilter,
} from './dto/stations-filter.dto';
import { GetUser } from 'src/decorators/user.decorator';
import { AccountEntity } from '../accounts/entities/account.entity';
import { Public } from 'src/decorators/public.decorator';

@ApiBearerAuth()
@ApiTags('stations')
@Controller('stations')
export class StationsController {
  constructor(private readonly stationsService: StationsService) {}

  // @Public()
  @Get()
  @ApiResponse({
    status: 200,
    description: 'GET ALL STATION',
    type: [StationDTO],
  })
  @UseInterceptors(MapInterceptor(StationEntity, StationDTO, { isArray: true }))
  async findAll(): Promise<StationEntity[]> {
    const listStation = await this.stationsService.getStations();
    if (listStation.length == 0) {
      throw new HttpException('No data station', HttpStatus.NOT_FOUND);
    }
    return listStation;
  }

  @Get('/byKitchenId/:id')
  // @Public()
  @ApiResponse({
    status: 200,
    description: 'KITCHEN GET STATION',
    type: StationDTO,
  })
  async getStationByKitchenId(
    @Query() filter: StationByKitchenId,
  ): Promise<StationEntity[]> {
    return await this.stationsService.getStationByKitchenId(filter);
  }

  @Get('/byKitchen')
  @Roles(RoleEnum.KITCHEN)
  @ApiResponse({
    status: 200,
    description: 'KITCHEN GET STATION',
    type: StationDTO,
  })
  async getStationByKitchen(
    @GetUser() user: AccountEntity,
  ): Promise<StationEntity[]> {
    return await this.stationsService.getStationByKitchen(user);
  }

  // @Public()
  @Get('/byStatus')
  @ApiResponse({
    status: 200,
    description: 'GET ALL STATION BY STATUS',
    type: [StationDTO],
  })
  @UseInterceptors(MapInterceptor(StationEntity, StationDTO, { isArray: true }))
  async getStationByStatus(
    @Query() statusFilter: StationStatusFilter,
  ): Promise<StationEntity[]> {
    const listStation = await this.stationsService.getStationsByStatus(
      statusFilter,
    );
    if (!listStation || listStation.length == 0) {
      throw new HttpException(
        "Dont't have resource station",
        HttpStatus.NOT_FOUND,
      );
    }
    return listStation;
  }

  // @Public()
  @Get('/active')
  @ApiResponse({
    status: 200,
    description: 'GET ALL STATION ACTIVE',
    type: [StationDTO],
  })
  @UseInterceptors(MapInterceptor(StationEntity, StationDTO, { isArray: true }))
  async findAllActiveStation(): Promise<StationEntity[]> {
    const listStation = await this.stationsService.getAllActiveStations();
    if (!listStation || listStation.length == 0) {
      throw new HttpException(
        "Dont't have resource station",
        HttpStatus.NOT_FOUND,
      );
    }
    return listStation;
  }

  // @Public()
  @Get('/:id')
  @ApiResponse({
    status: 200,
    description: 'GET STATION BY ID',
    type: StationDTO,
  })
  @UseInterceptors(MapInterceptor(StationEntity, StationDTO))
  async findStationById(@Param('id') id: string): Promise<StationEntity> {
    const station = await this.stationsService.findOne({
      where: { id: id },
    });
    if (!station) {
      throw new HttpException(
        "Dont't have resource station",
        HttpStatus.NOT_FOUND,
      );
    }
    return station;
  }

  // @Public()
  @Post()
  @Roles(RoleEnum.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'CREATE STATION',
    type: StationDTO,
  })
  @UseInterceptors(MapInterceptor(StationEntity, StationDTO))
  async createStation(
    @Body() createDTO: CreateStationDTO,
  ): Promise<StationEntity> {
    return this.stationsService.createStation(createDTO);
  }

  // @Public()
  @Put('/:id')
  @Roles(RoleEnum.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'UPDATE STATION',
    type: String,
  })
  async updateStation(
    @Param('id') id: string,
    @Body() updateDTO: UpdateStationDTO,
  ): Promise<string> {
    return this.stationsService.updateStation(id, updateDTO);
  }

  // @Public()
  @Put('/update-status/:id')
  @Roles(RoleEnum.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'UPDATE STATUS STATION',
    type: String,
  })
  async updateStatusStation(@Param('id') id: string): Promise<string> {
    return await this.stationsService.updateStatusStation(id);
  }
}
