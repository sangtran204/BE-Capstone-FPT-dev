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
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsActiveEnum } from 'src/common/enums/isActive.enum';
import { Public } from 'src/decorators/public.decorator';
import { MealDTO } from './dto/meal.dto';
import { UpdateStatusDTO } from './dto/updateStatus.dto';
import { MealEntity } from './entities/meal.entity';
import { MealsService } from './meals.service';

@ApiBearerAuth()
@ApiTags('meals')
@Controller('meals')
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  //Get all meal
  @Public()
  @Get()
  @ApiResponse({
    status: 200,
    description: 'GET ALL MEAL',
    type: [MealDTO],
  })
  async getAllMeal(): Promise<MealEntity[]> {
    const listMeals = await this.mealsService.getAllMeal();
    if (!listMeals || listMeals.length == 0) {
      throw new HttpException('No data meal', HttpStatus.NOT_FOUND);
    } else {
      return listMeals;
    }
  }
  // Thêm ===================================================
  @Public()
  @Post('/getMealByFlag/:flag')
  @ApiResponse({
    status: 200,
    description: 'GET ALL MEAL',
    type: [MealDTO],
  })
  async getMealByFlag(
    @Param('flag') flag: number,
    @Body() dto: MealDTO,
  ): Promise<MealEntity[]> {
    const listMeals = await this.mealsService.getMealByFlag(flag, dto);
    if (!listMeals || listMeals.length == 0) {
      throw new HttpException('No data meal', HttpStatus.NOT_FOUND);
    } else {
      return listMeals;
    }
  }
  // Thêm ===================================================
  //Create meal
  @Public()
  @Post()
  @ApiResponse({
    status: 200,
    description: 'CREATE MEAL',
    type: String,
  })
  async createMeal(@Body() dto: MealDTO): Promise<string> {
    return await this.mealsService.createMeal(dto);
  }

  //Update status
  @Public()
  @Put('/:id')
  @ApiResponse({
    status: 200,
    description: 'UPDATE MEAL STATUS',
    type: String,
  })
  async updateMealStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStatusDTO,
  ): Promise<string> {
    return await this.mealsService.updateMealStatus(id, dto);
  }
}
