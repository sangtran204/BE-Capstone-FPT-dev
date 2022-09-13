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
import { Public } from 'src/decorators/public.decorator';
import { KitchenDTO } from './dto/kitchen.dto';
import { KitchenEntity } from './entities/kitchens.entity';
import { KitchenService } from './kitchens.service';

@ApiBearerAuth()
@ApiTags('kitchens')
@Controller('kitchens')
export class KitchenController {
  constructor(private readonly kitchenService: KitchenService) {}

  //List all kitchen
  @Public()
  @Get()
  @ApiResponse({
    status: 200,
    description: 'GET ALL KITCHEN',
    type: [KitchenDTO],
  })
  async getAllKitchen(): Promise<KitchenEntity[] | string> {
    const listKitchen = await this.kitchenService.getAllKitchen();
    if (!listKitchen || listKitchen.length == 0) {
      throw new HttpException('No data kitchen', HttpStatus.NOT_FOUND);
    } else {
      return listKitchen;
    }
  }
  //Search kitchen by name
  // @Public()
  // @Get('/:name')
  // @ApiResponse({
  //   status: 200,
  //   description: 'SEARCH KITCHEN BY NAME',
  //   type: [KitchenDTO],
  // })
  // @UseInterceptors(MapInterceptor(KitchenEntity, KitchenDTO))
  // async searchKitchenByName(
  //   @Param('name') name: string,
  // ): Promise<KitchenEntity[] | string> {
  //   const listKitchens = await this.kitchenService.searchKitchenByName(name);
  //   if (!listKitchens || listKitchens.length == 0) {
  //     throw new HttpException('No data kitchen', HttpStatus.NOT_FOUND);
  //   } else {
  //     return listKitchens;
  //   }
  // }

  //Create kitchen
  @Public()
  @Post()
  @ApiResponse({
    status: 200,
    description: 'CREATE KITCHEN',
    type: KitchenDTO,
  })
  @UseInterceptors(MapInterceptor(KitchenEntity, KitchenDTO))
  async createKitchen(@Body() dto: KitchenDTO): Promise<KitchenEntity> {
    return await this.kitchenService.createKitchen(dto);
  }

  //Update kitchen
  @Public()
  @Post('/:id')
  @ApiResponse({
    status: 200,
    description: 'UPDATE KITCHEN',
    type: String,
  })
  async updateKitchen(
    @Param('id') id: string,
    @Body() dto: KitchenDTO,
  ): Promise<string> {
    return await this.kitchenService.updateKitchen(id, dto);
  }

  //Update kitchen status
  @Public()
  @Put('/:id')
  @ApiResponse({
    status: 200,
    description: 'UPDATE KITCHEN STATUS',
    type: String,
  })
  async deleteKitchen(@Param('id') id: string): Promise<string> {
    return await this.kitchenService.deleteKitchen(id);
  }
}
