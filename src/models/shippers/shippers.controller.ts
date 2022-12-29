import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Body,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleEnum } from 'src/common/enums/role.enum';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { GetUser } from 'src/decorators/user.decorator';
import { AccountEntity } from '../accounts/entities/account.entity';
import { ListShipperID } from './dto/addShipper.dto';
import {
  ShipperFilterDTO,
  ShipperStatusFilter,
} from './dto/shipper-status-filter.dto';
import { ShipperDTO } from './dto/shipper.dto';
import { UpdateShipperDTO } from './dto/update_shipper';
import { ShipperEntity } from './entities/shipper.entity';
import { ShippersService } from './shippers.service';

@ApiBearerAuth()
@ApiTags('shippers')
@Controller('shippers')
export class ShippersController {
  constructor(private readonly shippersService: ShippersService) {}

  @Get()
  // @Public()
  // @Roles(RoleEnum.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'GET ALL SHIPPER BY STATUS',
    type: [ShipperDTO],
  })
  // @UseInterceptors(MapInterceptor(ShipperEntity, ShipperDTO, { isArray: true }))
  async fidnAll(
    @Query() statusFilter: ShipperStatusFilter,
  ): Promise<ShipperEntity[]> {
    const listShip = await this.shippersService.findAll(statusFilter);
    if (!listShip || listShip.length == 0) {
      throw new HttpException(
        "Dont't have resource Shipper",
        HttpStatus.NOT_FOUND,
      );
    }
    return listShip;
  }

  @Get('/byKitchen')
  // @Roles(RoleEnum.KITCHEN)
  @ApiResponse({
    status: 200,
    description: 'GET SHIPPER BY KITCHEN',
    type: [ShipperEntity],
  })
  async getShipperByKitchen(
    @Query() filter: ShipperStatusFilter,
  ): Promise<ShipperEntity[]> {
    return await this.shippersService.getShipperByKitchen(filter);
  }

  @Get('/byStatus')
  // @Public()
  // @Roles(RoleEnum.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'GET ALL KITCHEN',
    type: [ShipperEntity],
  })
  async getShipperByStatus(
    @Query() filter: ShipperFilterDTO,
  ): Promise<ShipperEntity[]> {
    return await this.shippersService.getShipperByStatus(filter);
  }

  @Get('/free_shipper')
  // @Public()
  @ApiResponse({
    status: 200,
    description: 'GET SHIPPER BY ID',
    type: ShipperEntity,
  })
  async getFreeShipper(): Promise<ShipperEntity[]> {
    return await this.shippersService.getFreeShipper();
  }

  @Get('/:id')
  // @Public()
  @ApiResponse({
    status: 200,
    description: 'GET SHIPPER BY ID',
    type: ShipperDTO,
  })
  // @UseInterceptors(MapInterceptor(ShipperEntity, ShipperDTO))
  async findShipperByID(@Param('id') id: string): Promise<ShipperEntity> {
    const shipper = await this.shippersService.findOne({
      where: { id: id },
      relations: { account: { profile: true }, kitchen: true },
    });
    if (!shipper) {
      throw new HttpException(
        "Dont't have resource shipper",
        HttpStatus.NOT_FOUND,
      );
    }
    return shipper;
  }

  @Put('/addKitchen')
  @ApiResponse({
    status: 200,
    description: 'ADD SHIPPER TO KITCHEN',
    type: String,
  })
  async addShipperToKitchen(@Body() dto: ListShipperID): Promise<string> {
    return await this.shippersService.addShipperToKitchen(dto);
  }

  @Put('/:id')
  @ApiResponse({
    status: 200,
    description: 'UPDATE SHIPPER BY ID',
    type: ShipperDTO,
  })
  async updateShipper(
    @Param('id') id: string,
    @Body() update: UpdateShipperDTO,
  ): Promise<ShipperEntity> {
    return await this.shippersService.updateShipper(id, update);
  }

  // @Public()
  @Put('/status/:id')
  @ApiResponse({
    status: 200,
    description: 'UPDATE STATUS SHIPPER BY ID',
    type: ShipperDTO,
  })
  async inActiveShipper(@Param('id') id: string): Promise<string> {
    return await this.shippersService.updateStatusShipper(id);
  }

  // @Public()
  @Put('/off/byMe')
  @ApiResponse({
    status: 200,
    description: 'UPDATE STATUS SHIPPER BY SHIPPER',
    type: String,
  })
  async offByShipper(@GetUser() user: AccountEntity): Promise<string> {
    return await this.shippersService.offByShipper(user);
  }
}
