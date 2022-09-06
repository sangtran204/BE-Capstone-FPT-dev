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
import { ShippersService } from './shippers.service';
import { ShipperDTO } from './dto/shippers.dto';
import { ShipperEntity } from './entities/shippers.entity';
import { boolean } from 'joi';
import { async } from 'rxjs';

@ApiBearerAuth()
@ApiTags('shippers')
@Controller('shippers')
export class ShippersController {
  constructor(private readonly shippersService: ShippersService) {}

  //List all shipper
  @Public()
  @Get()
  @ApiResponse({
    status: 200,
    description: 'GET ALL SHIPPER',
    type: [ShipperDTO],
  })
  @UseInterceptors(
    MapInterceptor(ShipperEntity, ShipperDTO, {
      isArray: true,
    }),
  )
  async findAll(): Promise<ShipperEntity[] | { message: string }> {
    const listShippes = await this.shippersService.getAllShippers();
    if (listShippes.length == 0) {
      return { message: 'No Data Shipper' };
    } else {
      return listShippes;
    }
  }

  //Create shipper
  @Public()
  @Post()
  @ApiResponse({
    status: 200,
    description: 'CREATE SHIPPER',
    type: [ShipperDTO],
  })
  @UseInterceptors(MapInterceptor(ShipperEntity, ShipperDTO))
  async createShipper(
    @Body() dto: ShipperDTO,
  ): Promise<ShipperEntity | { message: string }> {
    const create = await this.shippersService.createShipper(dto);
    if (create) {
      return { message: 'Create shipper successfully' };
    } else {
      return { message: 'Create shipper fail' };
    }
  }

  //Remove shipper
  @Public()
  @Put('/:id')
  @ApiResponse({
    status: 200,
    description: 'DELETE SHIPPER',
    type: boolean,
  })
  @UseInterceptors(MapInterceptor(ShipperEntity, ShipperDTO))
  async deleteShipper(@Param('id') id: string): Promise<string> {
    if (await this.shippersService.deleteShipper(id)) {
      return 'Delete successfully';
    } else {
      return 'Delete fail';
    }
  }

  //Update shipper
  @Public()
  @Post('/:id')
  @ApiResponse({
    status: 200,
    description: 'DELETE SHIPPER',
    type: boolean,
  })
  @UseInterceptors(MapInterceptor(ShipperEntity, ShipperDTO))
  async updateShipper(
    @Param('id') id: string,
    @Body() dto: ShipperDTO,
  ): Promise<string> {
    if (await this.shippersService.updateShipper(id, dto)) {
      return 'Update successfull';
    } else {
      return 'Update fail';
    }
  }

  //Find shipper
  @Public()
  @Get('/:id')
  @ApiResponse({
    status: 200,
    description: 'DELETE SHIPPER',
    type: boolean,
  })
  @UseInterceptors(MapInterceptor(ShipperEntity, ShipperDTO))
  async findById(@Param('id') id: string): Promise<ShipperEntity | string> {
    const find = await this.shippersService.findOne({ where: { id: id } });
    if (find != null) {
      return find;
    } else {
      return 'No shipper found';
    }
  }
}
