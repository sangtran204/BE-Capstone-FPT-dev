import {
  Body,
  Get,
  Param,
  Put,
  HttpException,
  HttpStatus,
  Controller,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { KitchenDTO } from './dto/kitchen.dto';
import { UpdateKitchenDTO } from './dto/update_kitchen.dto';
import { KitchenEntity } from './entities/kitchens.entity';
import { KitchenService } from './kitchens.service';

@ApiBearerAuth()
@ApiTags('kitchens')
@Controller('kitchens')
export class KitchenController {
  constructor(private readonly kitchenService: KitchenService) {}

  @Get()
  // @Public()
  // @Roles(RoleEnum.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'GET ALL KITCHEN',
    type: [KitchenDTO],
  })
  // @UseInterceptors(MapInterceptor(KitchenEntity, KitchenDTO, { isArray: true }))
  async fidnAll(): Promise<KitchenEntity[]> {
    const listKitchen = await this.kitchenService.query({
      relations: { account: { profile: true } },
    });
    if (!listKitchen || listKitchen.length == 0) {
      throw new HttpException(
        "Dont't have resource Kitchen",
        HttpStatus.NOT_FOUND,
      );
    }
    return listKitchen;
  }

  @Get('/:id')
  // @Public()
  @ApiResponse({
    status: 200,
    description: 'GET KITCHEN BY ID',
    type: KitchenDTO,
  })
  // @UseInterceptors(MapInterceptor(KitchenEntity, KitchenDTO))
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
  // @Public()
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

  @Put('/:id')
  @ApiResponse({
    status: 200,
    description: 'ADMIN UPDATE KITCHEN BY ID',
    type: KitchenDTO,
  })
  async updateKitchenByAdmin(
    @Param('id') id: string,
    @Body() update: UpdateKitchenDTO,
  ): Promise<KitchenEntity> {
    return await this.kitchenService.updateKitchen(id, update);
  }

  @Put('/status/:id')
  // @Public()
  @ApiResponse({
    status: 200,
    description: 'ADMIN UPDATE STATUS KITCHEN BY ID',
    type: KitchenDTO,
  })
  async updateStatusKitchen(@Param('id') id: string): Promise<string> {
    return await this.kitchenService.updateStatusKitchen(id);
  }
}
