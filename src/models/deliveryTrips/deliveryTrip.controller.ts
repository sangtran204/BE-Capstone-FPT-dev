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
import {
  AssignShipperDTO,
  // CreateDeliveryTripDTO,
  CreateTripDTO,
} from './dto/createDeliveryTrip.dto';
import {
  TripFilter,
  TripFilterByKitchen,
  TripFilterBySession,
  TripFilterDate,
} from './dto/deliveryTrip-filter.dto';
import { DeliveryTripDTO } from './dto/deliveryTrip.dto';
import { DirectShipperDTO, UpdateStatusTrip } from './dto/updateStatusTrip.dto';
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
  async getAll(
    @Query() filter: TripFilter,
  ): Promise<DeliveryTripEntity[] | string> {
    const listTrip = await this.deliveryTripService.getAllDeliveryTrip(filter);
    if (!listTrip || listTrip.length == 0) {
      throw new HttpException('No data delivery trip', HttpStatus.NOT_FOUND);
    } else {
      return listTrip;
    }
  }

  @Get('/byShipper/byStatus')
  @ApiResponse({
    status: 200,
    description: 'GET DELIVERY TRIP BY SHIPPER + STATUS',
    type: [DeliveryTripDTO],
  })
  async getDeliveryTripByStatus(
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

  @Get('/byShipper')
  @ApiResponse({
    status: 200,
    description: 'GET DELIVERY TRIP BY SHIPPER',
    type: [DeliveryTripDTO],
  })
  async getDeliveryTripByShipper(
    @GetUser() user: AccountEntity,
  ): Promise<DeliveryTripEntity[]> {
    const listTrip = await this.deliveryTripService.getDeliveryTripByShipper(
      user,
    );
    if (!listTrip || listTrip.length == 0) {
      throw new HttpException('No data delivery trip', HttpStatus.NOT_FOUND);
    } else {
      return listTrip;
    }
  }

  @Get('/byShipper/byDate')
  @ApiResponse({
    status: 200,
    description: 'GET DELIVERY TRIP BY SHIPPER',
    type: [DeliveryTripDTO],
  })
  async getDeliveryTripByDate(
    @GetUser() kitchen: AccountEntity,
    @Query() filter: TripFilterDate,
  ): Promise<DeliveryTripEntity[]> {
    const listTrip =
      await this.deliveryTripService.getDeliveryTripByDeliveryDate(
        kitchen,
        filter,
      );
    if (!listTrip || listTrip.length == 0) {
      throw new HttpException('No data delivery trip', HttpStatus.NOT_FOUND);
    } else {
      return listTrip;
    }
  }

  // @Get('/byKitchen')
  // @ApiResponse({
  //   status: 200,
  //   description: 'GET DELIVERY TRIP BY SHIPPER',
  //   type: [DeliveryTripDTO],
  // })
  // async getDeliveryTripByKitchen(
  //   @GetUser() kitchen: AccountEntity,
  //   @Query() filter: TripFilterByKitchen,
  // ): Promise<DeliveryTripEntity[]> {
  //   const listTrip = await this.deliveryTripService.getDeliveryTripByKitchen(
  //     kitchen,
  //     filter,
  //   );
  //   if (!listTrip || listTrip.length == 0) {
  //     throw new HttpException('No data delivery trip', HttpStatus.NOT_FOUND);
  //   } else {
  //     return listTrip;
  //   }
  // }

  @Get('/byId/:id')
  @Public()
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

  @Get('/bySession')
  @Public()
  @ApiResponse({
    status: 200,
    description: 'GET DELIVERY TRIP BY SESSION',
    type: [DeliveryTripEntity],
  })
  async getTripBySession(
    @Query() filter: TripFilterBySession,
  ): Promise<DeliveryTripEntity[]> {
    return await this.deliveryTripService.getDeliveryTripBySession(filter);
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

  // @Post()
  // @Roles(RoleEnum.MANAGER)
  // @ApiResponse({
  //   status: 200,
  //   description: 'CREATE DELIVERY TRIP',
  //   type: [DeliveryTripEntity],
  // })
  // async createDeliveryTrip(
  //   // @GetUser() user: AccountEntity,
  //   @Body() dto: CreateDeliveryTripDTO,
  // ): Promise<DeliveryTripEntity> {
  //   return await this.deliveryTripService.createDeliveryTrip(dto);
  // }

  @Post()
  // @Roles(RoleEnum.MANAGER)
  @Public()
  @ApiResponse({
    status: 200,
    description: 'CREATE DELIVERY TRIP',
    type: [DeliveryTripEntity],
  })
  async createDeliveryTrip(
    // @GetUser() user: AccountEntity,
    @Body() dto: CreateTripDTO,
  ): Promise<DeliveryTripEntity[]> {
    return await this.deliveryTripService.createTrip(dto);
  }

  @Post('/shipper_toTrip')
  // @Roles(RoleEnum.MANAGER)
  @Public()
  @ApiResponse({
    status: 200,
    description: 'ASSIGN SHIPPER TO TRIP',
    type: [DeliveryTripEntity],
  })
  async assignShipperToTrip(
    // @GetUser() user: AccountEntity,
    @Body() dto: AssignShipperDTO,
  ): Promise<DeliveryTripEntity[]> {
    return await this.deliveryTripService.assignShipperToTrip(dto);
  }

  @Put('/reject/:id')
  @Roles(RoleEnum.SHIPPER)
  @ApiResponse({
    status: 200,
    description: 'REJECT DELIVERY TRIP',
    type: String,
  })
  async rejectDeliveryTrip(
    @Param('id') id: string,
    @GetUser() user: AccountEntity,
  ): Promise<string> {
    return await this.deliveryTripService.rejectByShipper(id, user);
  }

  @Put('/transfer')
  @Roles(RoleEnum.MANAGER)
  @ApiResponse({
    status: 200,
    description: 'MANAGER TRANSFER SHIPPER',
    type: String,
  })
  async transferShipper(@Query() transfer: DirectShipperDTO): Promise<string> {
    return await this.deliveryTripService.directShipperByManager(transfer);
  }
}
