import { MapInterceptor } from '@automapper/nestjs';
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  UseInterceptors,
  Param,
  Body,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
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
    description: 'GET ALL KITCHEN',
    type: [ShipperDTO],
  })
  // @UseInterceptors(MapInterceptor(ShipperEntity, ShipperDTO, { isArray: true }))
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

  @Put('/status/:id')
  @ApiResponse({
    status: 200,
    description: 'INACTIVE SHIPPER BY ID',
    type: ShipperDTO,
  })
  async inActiveShipper(@Param('id') id: string): Promise<string> {
    return await this.shippersService.inActiveShipper(id);
  }
}
