import {
  Body,
  Get,
  Post,
  Param,
  Put,
  HttpException,
  HttpStatus,
  Controller,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { ListShipperID } from './dto/add_shipper.dto';
import { KitchenDTO } from './dto/kitchen.dto';
import { KitchenFilterDTO } from './dto/kitchenFilter.dto';
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

  @Get('/byStatus')
  // @Public()
  // @Roles(RoleEnum.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'GET ALL KITCHEN',
    type: [KitchenEntity],
  })
  // @UseInterceptors(MapInterceptor(KitchenEntity, KitchenDTO, { isArray: true }))
  async getKitchenByStatus(
    @Query() filter: KitchenFilterDTO,
  ): Promise<KitchenEntity[]> {
    return await this.kitchenService.getKitchenByStatus(filter);
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

  // @Get('shipper/:id')
  // // @Public()
  // @ApiResponse({
  //   status: 200,
  //   description: 'GET SHIPPER OF KITCHEN BY ID',
  //   type: KitchenDTO,
  // })
  // async findShipOfKitchen(@Param('id') id: string): Promise<KitchenEntity> {
  //   const listKitchen = await this.kitchenService.findOne({
  //     where: { id: id },
  //     relations: { shippers: { account: { profile: true } } },
  //   });
  //   if (!listKitchen) {
  //     throw new HttpException(
  //       "Dont't have resource Kitchen",
  //       HttpStatus.NOT_FOUND,
  //     );
  //   }
  //   return listKitchen;
  // }

  // @Post('/addShipper/:id')
  // // @Public()
  // @ApiResponse({
  //   status: 200,
  //   description: 'ADD SHIPPER FOR KITCHEN BY ID KITCHEN',
  //   type: KitchenDTO,
  // })
  // async addShipperForKitchen(
  //   @Param('id') idKitchen: string,
  //   @Body() listShipperID: ListShipperID,
  // ): Promise<string> {
  //   return await this.kitchenService.addShipperForKitchen(
  //     idKitchen,
  //     listShipperID,
  //   );
  // }

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
