import { Repository } from 'typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../base/base.service';
import { MealDTO } from './dto/meal.dto';
import { MealEntity } from './entities/meal.entity';
import { UpdateStatusDTO } from './dto/updateStatus.dto';
import { TimeSlotsService } from '../timeSlots/timeSlots.service';

@Injectable()
export class MealsService extends BaseService<MealEntity> {
  constructor(
    @InjectRepository(MealEntity)
    private readonly mealsRepository: Repository<MealEntity>,
    private readonly timeSlotService: TimeSlotsService,
  ) {
    super(mealsRepository);
  }

  async getAllMeal(): Promise<MealEntity[]> {
    return await this.mealsRepository.find();
  }
  // Thêm ===================================================
  async getMealByFlag(flag: number, dto: MealDTO): Promise<MealEntity[]> {
    return await this.mealsRepository
      .createQueryBuilder('meals')
      .leftJoinAndSelect('meals.timeSlots', 'timeslots')
      .where('timeslots.flag = :flag', {
        flag: flag,
      })
      .andWhere('meals.dateOfMeal LIKE :dateOfMeal', {
        dateOfMeal: dto.dateOfMeal,
      })
      .getMany();
  } // Thêm ===================================================

  async createMeal(dto: MealDTO): Promise<string> {
    try {
      const timeSlot = await this.timeSlotService.findOne({
        where: { id: dto.timeSlotId },
      });
      if (!timeSlot) {
        throw new HttpException(
          `${dto.timeSlotId} not found`,
          HttpStatus.NOT_FOUND,
        );
      } else {
        await this.mealsRepository.save({
          dateOfMeal: dto.dateOfMeal,
          timeSlots: timeSlot,
        });
        return 'Create meal successfull';
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async updateMealStatus(id: string, dto: UpdateStatusDTO): Promise<string> {
    const meal = await this.mealsRepository.findOne({ where: { id: id } });
    if (meal == null) {
      throw new HttpException(`${id} not found`, HttpStatus.NOT_FOUND);
    } else {
      try {
        await this.mealsRepository.update(
          { id: id },
          {
            isActive: dto.isActive,
          },
        );
        return `Meal is ${dto.isActive}`;
      } catch (error) {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
    }
  }
}
