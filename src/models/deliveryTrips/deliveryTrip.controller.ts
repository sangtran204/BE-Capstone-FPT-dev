import { MapInterceptor } from '@automapper/nestjs';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RoleEnum } from 'src/common/enums/role.enum';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { GetUser } from 'src/decorators/user.decorator';
import { AccountEntity } from '../accounts/entities/account.entity';
import { DeliveryTripService } from './deliveryTrip.service';
import { CreateDeliveryTripDTO } from './dto/createDeliveryTrip.dto';
import { TripFilter } from './dto/deliveryTrip-filter.dto';
import { DeliveryTripDTO } from './dto/deliveryTrip.dto';
import { UpdateStatusTrip } from './dto/updateStatusTrip.dto';
import { DeliveryTripEntity } from './entities/deliveryTrip.entity';

@ApiBearerAuth()
@ApiTags('delivery_trips')
@Controller('delivery_trips')
export class DeliveryTripController {
  constructor(private readonly deliveryTripService: DeliveryTripService) {}

  //Get all delivery trip
  // @Public()
  @Get()
  @ApiResponse({
    status: 200,
    description: 'GET ALL DELIVERY TRIP',
    type: [DeliveryTripDTO],
  })
  async getAll(): Promise<DeliveryTripEntity[] | string> {
    const listTrip = await this.deliveryTripService.getAllDeliveryTrip();
    if (!listTrip || listTrip.length == 0) {
      throw new HttpException('No data delivery trip', HttpStatus.NOT_FOUND);
    } else {
      return listTrip;
    }
  }

  @Get('/byShipper')
  @ApiResponse({
    status: 200,
    description: 'GET DELIVERY TRIP BY SHIPPER',
    type: [DeliveryTripDTO],
  })
  async getDeliveryTripByShipper(
    @GetUser() user: AccountEntity,
    @Query() filter: TripFilter,
  ): Promise<DeliveryTripEntity[]> {
    const listTrip = await this.deliveryTripService.getDeliveryTripByStatus(
      user,
      filter,
    );
    if (!listTrip || listTrip.length == 0) {
      throw new HttpException('No data delivery trip', HttpStatus.NOT_FOUND);
    } else {
      return listTrip;
    }
  }

  @Get('/byId/:id')
  @ApiResponse({
    status: 200,
    description: 'GET DELIVERY TRIP BY ID',
    type: [DeliveryTripDTO],
  })
  async getDeliveryTripById(
    @Param('id') id: string,
  ): Promise<DeliveryTripEntity> {
    return this.deliveryTripService.getTripById(id);
  }

  @Post('/update_status/:id')
  @ApiResponse({
    status: 200,
    description: 'UPDATE DELIVERY TRIP STATUS',
  })
  async updateTripStatus(
    @Body() orderIds: UpdateStatusTrip,
  ): Promise<DeliveryTripEntity> {
    return await this.deliveryTripService.updateStatusTrip(orderIds);
  }

  @Post()
  @Roles(RoleEnum.KITCHEN)
  @ApiResponse({
    status: 200,
    description: 'CREATE DELIVERY TRIP',
    type: [DeliveryTripEntity],
  })
  async createDeliveryTrip(
    @GetUser() user: AccountEntity,
    @Body() dto: CreateDeliveryTripDTO,
  ): Promise<DeliveryTripEntity> {
    return await this.deliveryTripService.createDeliveryTrip(user, dto);
  }
}
