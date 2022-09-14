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
  async listAllFoodGroup(): Promise<FoodGroupEntity[] | string> {
    const listFoodGroup = await this.foodGroupService.getAllFoodGroup();
    if (!listFoodGroup || listFoodGroup.length == 0) {
      throw new HttpException('No data food group', HttpStatus.NOT_FOUND);
    } else {
      return listFoodGroup;
    }
  }

  //List all foodgroup active
  @Public()
  @Get('/available')
  @ApiResponse({
    status: 200,
    description: 'LIST ALL FOOD GROUP ACTIVE',
    type: [FoodGroupDTO],
  })
  async listFoodGroupActive(): Promise<FoodGroupEntity[]> {
    const listFoodGroupActive =
      await this.foodGroupService.getFoodGroupActive();
    if (!listFoodGroupActive || listFoodGroupActive.length == 0) {
      throw new HttpException('No food group active', HttpStatus.NOT_FOUND);
    } else {
      return listFoodGroupActive;
    }
  }

  //Create foodGroup
  @Public()
  @Post()
  @ApiResponse({
    status: 200,
    description: 'CREATE FOOD GROUP',
    type: String,
  })
  async createFoodGroup(@Body() dto: FoodGroupDTO): Promise<string> {
    return await this.foodGroupService.createFoodGroup(dto);
  }

  //Update food group
  @Public()
  @Put('/:id')
  @ApiResponse({
    status: 200,
    description: 'UPDATE FOOD GROUP',
    type: String,
  })
  async updateFoodGroup(
    @Param('id') id: string,
    @Body() dto: FoodGroupDTO,
  ): Promise<string> {
    return this.foodGroupService.updateFoodGroup(id, dto);
  }

  //Update food group status
  @Public()
  @Put('/updateStatus/:id')
  @ApiResponse({
    status: 200,
    description: 'UPDATE FOOD GROUP STATUS',
    type: String,
  })
  async updateFoodGroupStatus(@Param('id') id: string): Promise<string> {
    return this.foodGroupService.updateFoodGroupStatus(id);
  }

  //Delet food group
  @Public()
  @Delete('/:id')
  @ApiResponse({
    status: 200,
    description: 'DELETE FOOD GROUP',
    type: String,
  })
  async deleteFoodGroup(@Param('id') id: string): Promise<string> {
    return this.foodGroupService.deleteFoodGroup(id);
  }
}
