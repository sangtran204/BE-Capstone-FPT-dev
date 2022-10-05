import { MapInterceptor } from '@automapper/nestjs';
import {
  Body,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
  HttpException,
  HttpStatus,
  Controller,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleEnum } from 'src/common/enums/role.enum';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { KitchenDTO } from './dto/kitchen.dto';
import { KitchenEntity } from './entities/kitchens.entity';
import { KitchenService } from './kitchens.service';

@ApiBearerAuth()
@ApiTags('kitchens')
@Controller('kitchens')
export class KitchenController {
  constructor(private readonly kitchenService: KitchenService) {}

  @Get()
  @Public()
  // @Roles(RoleEnum.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'GET ALL KITCHEN',
    type: [KitchenDTO],
  })
  async fidnAll(): Promise<KitchenEntity[]> {
    const listKitchen = await this.kitchenService.findAll();
    if (!listKitchen || listKitchen.length == 0) {
      throw new HttpException(
        "Dont't have resource Kitchen",
        HttpStatus.NOT_FOUND,
      );
    }
    return listKitchen;
  }

  @Get('/:id')
  @Public()
  @ApiResponse({
    status: 200,
    description: 'GET KITCHEN BY ID',
    type: KitchenDTO,
  })
  async findKitchenByID(@Param('id') id: string): Promise<KitchenEntity> {
    const listKitchen = await this.kitchenService.findOne({
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

  @Get('shipper/:id')
  @Public()
  @ApiResponse({
    status: 200,
    description: 'GET KITCHEN BY ID',
    type: KitchenDTO,
  })
  async findShipOfKitchen(@Param('id') id: string): Promise<KitchenEntity> {
    const listKitchen = await this.kitchenService.findOne({
      where: { id: id },
      relations: { shippers: true },
    });
    if (!listKitchen) {
      throw new HttpException(
        "Dont't have resource Kitchen",
        HttpStatus.NOT_FOUND,
      );
    }
    return listKitchen;
  }
}
