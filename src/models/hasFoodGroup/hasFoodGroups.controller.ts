import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { HasFoodGroupService } from './hasFoodGroups.service';
import { Public } from 'src/decorators/public.decorator';
import { HasFoodGroupEntity } from './entities/hasFoodGroup.entity';
import { HasFoodGroupDTO } from './dto/hasFoodGroup.dto';

@ApiBearerAuth()
@ApiTags('hasFoodGroup')
@Controller('hasFoodGroup')
export class HasFoodGroupController {
  constructor(private readonly hasFoodGroupService: HasFoodGroupService) {}

  //GetAllHasFoodGroup
  @Public()
  @Get()
  @ApiResponse({
    status: 200,
    description: 'GET ALL HAS_FOOD_GROUP',
    type: [HasFoodGroupEntity],
  })
  async getAllHasFoodGroup(): Promise<HasFoodGroupEntity[]> {
    const listGroup = await this.hasFoodGroupService.getAllHasFoodGroup();
    if (!listGroup || listGroup.length == 0) {
      throw new HttpException('No data hasFoodGroup', HttpStatus.NOT_FOUND);
    } else {
      return listGroup;
    }
  }

  //Get hasFoodGroup by package
  @Public()
  @Get('/:id')
  @ApiResponse({
    status: 200,
    description: 'GET ALL HAS_FOOD_GROUP',
    type: [HasFoodGroupEntity],
  })
  async getHasFoodGroupByPackage(
    @Param('id') id: string,
  ): Promise<HasFoodGroupEntity[]> {
    const listHasFoodGroup =
      await this.hasFoodGroupService.getHasFoodGroupByPackage(id);
    if (!listHasFoodGroup) {
      throw new HttpException('No hasFoodGroup data', HttpStatus.NOT_FOUND);
    } else {
      return listHasFoodGroup;
    }
  }

  //Create hasFoodGroup
  @Public()
  @Post()
  @ApiResponse({
    status: 200,
    description: 'CREATE HAS_FOOD_GROUP',
    type: String,
  })
  async createHasFoodGroup(@Body() dto: HasFoodGroupDTO): Promise<string> {
    return this.hasFoodGroupService.creatHasFoodGroup(dto);
  }

  //Delete hasFoodGroup by packageId, id
  @Public()
  @Delete('/:id')
  @ApiResponse({
    status: 200,
    description: 'DELETE HAS_FOOD_GROUP',
    type: String,
  })
  async deleteHasFoodGroup(
    // @Body() dto: HasFoodGroupDTO,
    @Param('id') id: string,
  ): Promise<string> {
    return this.hasFoodGroupService.deleteHasFoodGroup(id);
  }

  //Delete item in hasFoodGroup by id
  @Public()
  @Delete('/item/:id')
  @ApiResponse({
    status: 200,
    description: 'DELETE ITEM HAS_FOOD_GROUP',
    type: String,
  })
  async deleteItemHasFoodGroup(@Param('id') id: string): Promise<string> {
    return await this.hasFoodGroupService.deleteItemHasFoodGroup(id);
  }
}
