import { MapInterceptor } from '@automapper/nestjs';
import {
  Body,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
  Delete,
  HttpException,
  HttpStatus,
  Controller,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { FoodGroupDTO } from './dto/foodGroup.dto';
import { FoodGroupEntity } from './entities/foodGroups.entity';
import { FoodGroupService } from './foodGroups.service';

@ApiBearerAuth()
@ApiTags('foodGroups')
@Controller('foodGroups')
export class FoodGroupController {
  constructor(private readonly foodGroupService: FoodGroupService) {}

  //List all foodGroup
  @Public()
  @Get()
  @ApiResponse({
    status: 200,
    description: 'LIST ALL FOOD GROUP',
    type: [FoodGroupDTO],
  })
  @UseInterceptors(MapInterceptor(FoodGroupEntity, FoodGroupDTO))
  async listAllFoodGroup(): Promise<FoodGroupEntity[] | string> {
    const listFoodGroup = await this.foodGroupService.getAllFoodGroup();
    if (!listFoodGroup || listFoodGroup.length == 0) {
      throw new HttpException('No data food group', HttpStatus.NOT_FOUND);
    } else {
      return listFoodGroup;
    }
  }

  //Create foodGroup
  @Public()
  @Post()
  @ApiResponse({
    status: 200,
    description: 'CREATE FOOD GROUP',
    type: FoodGroupDTO,
  })
  @UseInterceptors(MapInterceptor(FoodGroupEntity, FoodGroupDTO))
  async createFoodGroup(@Body() dto: FoodGroupDTO): Promise<string> {
    return await this.foodGroupService.createFoodGroup(dto);
  }

  //Update food group
  @Public()
  @Put('/:id')
  @ApiResponse({
    status: 200,
    description: 'UPDATE FOOD GROUP',
    type: FoodGroupDTO,
  })
  @UseInterceptors(MapInterceptor(FoodGroupEntity, FoodGroupDTO))
  async updateFoodGroup(
    @Param('id') id: string,
    @Body() dto: FoodGroupDTO,
  ): Promise<string> {
    return this.foodGroupService.updateFoodGroup(id, dto);
  }

  //Update food group status
  @Public()
  @Put('/update.status/:id')
  @ApiResponse({
    status: 200,
    description: 'UPDATE FOOD GROUP STATUS',
    type: FoodGroupDTO,
  })
  @UseInterceptors(MapInterceptor(FoodGroupEntity, FoodGroupDTO))
  async updateFoodGroupStatus(@Param('id') id: string): Promise<string> {
    return this.foodGroupService.updateFoodGroupStatus(id);
  }

  //Delet food group
  @Public()
  @Delete('/:id')
  @ApiResponse({
    status: 200,
    description: 'DELETE FOOD GROUP',
    type: FoodGroupDTO,
  })
  @UseInterceptors(MapInterceptor(FoodGroupEntity, FoodGroupDTO))
  async deleteFoodGroup(@Param('id') id: string): Promise<string> {
    return this.foodGroupService.deleteFoodGroup(id);
  }
}
