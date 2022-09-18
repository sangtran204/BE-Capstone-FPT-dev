import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MapInterceptor } from '@automapper/nestjs';
import {
  Get,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { FoodGroupItemService } from './food-group-item.service';
import { Public } from 'src/decorators/public.decorator';
import { FoodGroupItemEntity } from './entities/food-group-item.entity';
import { FoodGroupItemDTO } from './dto/food-group-item.dto';

@ApiBearerAuth()
@ApiTags('food-group-item')
@Controller('food-group-item')
export class FoodGroupItemController {
  constructor(private readonly foodGroupItemService: FoodGroupItemService) {}

  @Public()
  @Get()
  @UseInterceptors(
    MapInterceptor(FoodGroupItemEntity, FoodGroupItemDTO, { isArray: true }),
  )
  async findAllFoodGroupItem(): Promise<FoodGroupItemEntity[]> {
    const listItem = await this.foodGroupItemService.getFoodGroupItem();
    if (!listItem || listItem.length == 0) {
      throw new HttpException("Dont't have resource", HttpStatus.NOT_FOUND);
    }
    return listItem;
  }
}
