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
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleEnum } from 'src/common/enums/role.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { CreateFoodGroupDTO } from './dto/create-food-group.dto';
import { FoodGroupDTO } from './dto/food-group.dto';
import { FoodGroupFilterDTO } from './dto/foodGroup-filter.dto';
import { UpdateFoodGroupDTO } from './dto/update-food-group.dto';
import { FoodGroupEntity } from './entities/food-group.entity';
import { FoodGroupService } from './food-group.service';

@ApiBearerAuth()
@ApiTags('food-groups')
@Controller('food-groups')
export class FoodGroupController {
  constructor(private readonly foodGroupService: FoodGroupService) {}

  //List all foodGroup
  @Get()
  @ApiResponse({
    status: 200,
    description: 'LIST ALL FOOD GROUP',
    type: [FoodGroupDTO],
  })
  // @UseInterceptors(
  //   MapInterceptor(FoodGroupEntity, FoodGroupDTO, { isArray: true }),
  // )
  async listAllFoodGroup(): Promise<FoodGroupEntity[]> {
    const listFoodGroup = await this.foodGroupService.getAllFoodGroup();
    if (!listFoodGroup || listFoodGroup.length == 0) {
      throw new HttpException('No data food group', HttpStatus.NOT_FOUND);
    } else {
      return listFoodGroup;
    }
  }

  @Get('/byStatus')
  @ApiResponse({
    status: 200,
    description: 'LIST FOOD GROUP BY STATUS',
    type: [FoodGroupDTO],
  })
  async getFoodGroupByStatus(
    @Query() foodGroupFilter: FoodGroupFilterDTO,
  ): Promise<FoodGroupEntity[]> {
    const listFoodGroup = await this.foodGroupService.getFoodGroupByStatus(
      foodGroupFilter,
    );
    if (!listFoodGroup || listFoodGroup.length == 0) {
      throw new HttpException('No data food group', HttpStatus.NOT_FOUND);
    } else {
      return listFoodGroup;
    }
  }

  @Get('find/:id')
  @ApiResponse({
    status: 200,
    description: 'GET FOODGROUP BY ID',
    type: FoodGroupDTO,
  })
  @UseInterceptors(MapInterceptor(FoodGroupEntity, FoodGroupDTO))
  async findFoodById(@Param('id') id: string): Promise<FoodGroupEntity> {
    const foodGroup = await this.foodGroupService.findOne({
      where: { id: id },
      relations: { foods: { foodCategory: true } },
    });
    if (!foodGroup) {
      throw new HttpException("Dont't have resource", HttpStatus.NOT_FOUND);
    }
    return foodGroup;
  }

  //Create foodGroup
  @Roles(RoleEnum.MANAGER)
  @Post()
  @ApiResponse({
    status: 200,
    description: 'Create food group',
    type: FoodGroupDTO,
  })
  @UseInterceptors(MapInterceptor(FoodGroupEntity, FoodGroupDTO))
  async createFoodGroup(
    @Body() createDTO: CreateFoodGroupDTO,
  ): Promise<FoodGroupEntity> {
    return await this.foodGroupService.createFoodGroup(createDTO);
  }

  //Update food group
  @Roles(RoleEnum.MANAGER)
  @Put('/:id')
  @ApiResponse({
    status: 200,
    description: 'UPDATE FOOD GROUP',
    type: String,
  })
  async updateFoodGroup(
    @Param('id') id: string,
    @Body() updateDTO: UpdateFoodGroupDTO,
  ): Promise<string> {
    return await this.foodGroupService.updateFoodGroup(id, updateDTO);
  }

  //Update food group status
  @Roles(RoleEnum.MANAGER)
  @Put('/active/:id')
  @ApiResponse({
    status: 200,
    description: 'UPDATE FOOD GROUP STATUS',
    type: String,
  })
  async updateFoodGroupStatus(@Param('id') id: string): Promise<string> {
    return await this.foodGroupService.updateFoodGroupStatus(id);
  }

  //Remove food group
  @Roles(RoleEnum.MANAGER)
  @Put('/remove/:id')
  @ApiResponse({
    status: 200,
    description: 'REMOVE FOOD GROUP',
    type: String,
  })
  async removeFoodGroup(@Param('id') id: string): Promise<string> {
    return await this.foodGroupService.removeFoodGroup(id);
  }
}
