import { MapInterceptor } from '@automapper/nestjs';
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  UseInterceptors,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleEnum } from 'src/common/enums/role.enum';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { GetUser } from 'src/decorators/user.decorator';
import { AccountEntity } from '../accounts/entities/account.entity';
import { ShipperDTO } from './dto/shipper.dto';
import { ShipperEntity } from './entities/shipper.entity';
import { ShippersService } from './shippers.service';

@ApiBearerAuth()
@ApiTags('shippers')
@Controller('shippers')
export class ShippersController {
  constructor(private readonly shippersService: ShippersService) {}

  @Get()
  @Public()
  // @Roles(RoleEnum.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'GET ALL KITCHEN',
    type: [ShipperDTO],
  })
  @UseInterceptors(MapInterceptor(ShipperEntity, ShipperDTO, { isArray: true }))
  async fidnAll(): Promise<ShipperEntity[]> {
    const listShip = await this.shippersService.findAll();
    if (!listShip || listShip.length == 0) {
      throw new HttpException(
        "Dont't have resource Kitchen",
        HttpStatus.NOT_FOUND,
      );
    }
    return listShip;
  }

  @Get('/:id')
  @Public()
  @ApiResponse({
    status: 200,
    description: 'GET SHIPPER BY ID',
    type: ShipperDTO,
  })
  @UseInterceptors(MapInterceptor(ShipperEntity, ShipperDTO))
  async findKitchenByID(@Param('id') id: string): Promise<ShipperEntity> {
    const listKitchen = await this.shippersService.findOne({
      where: { id: id },
      relations: { account: { profile: true } },
    });
    if (!listKitchen) {
      throw new HttpException(
        "Dont't have resource Kitchen",
        HttpStatus.NOT_FOUND,
      );
    }
    return listKitchen;
  }

  @Roles(RoleEnum.KITCHEN)
  @Get('/kitchen/:idHotel')
  @ApiResponse({
    status: 200,
    description: 'GET SHIPPER BY KITCHEN',
    type: [ShipperDTO],
  })
  async getShipperByKitchenID(
    @Param('idHotel') idHotel: string,
    @GetUser() user: AccountEntity,
  ): Promise<ShipperEntity[]> {
    const listShip = await this.shippersService.getShipperByKitchenID(
      idHotel,
      user,
    );
    if (!listShip) {
      throw new HttpException(
        "Dont't have resource shipper",
        HttpStatus.NOT_FOUND,
      );
    }
    return listShip;
  }
}
