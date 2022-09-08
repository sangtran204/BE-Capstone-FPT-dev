import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../base/base.service';
import { TimeSlotEntity } from './entities/timeSlots.entity';
import { TimeSlotDTO } from './dto/timeSlot.dto';

@Injectable()
export class TimeSlotsService extends BaseService<TimeSlotEntity> {
  constructor(
    @InjectRepository(TimeSlotEntity)
    private readonly timeSlotsRepository: Repository<TimeSlotEntity>,
  ) {
    super(timeSlotsRepository);
  }

  async getAllTimeSlot(): Promise<TimeSlotEntity[]> {
    return await this.timeSlotsRepository.find();
  }

  async getTimeSlotFlag(flag: number): Promise<TimeSlotEntity[]> {
    return await this.timeSlotsRepository.find({
      where: {
        flag: flag,
      },
    });
  }

  async createTimeSlot(dto: TimeSlotDTO): Promise<boolean> {
    try {
      await this.timeSlotsRepository.save({
        startTime: dto.startTime,
        endTime: dto.endTime,
        flag: dto.flag,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async deleteTimeSlot(id: string): Promise<boolean> {
    const timeSlot = await this.timeSlotsRepository.findOne({
      where: { id: id },
    });
    if (timeSlot != null) {
      await this.timeSlotsRepository
        .createQueryBuilder()
        .delete()
        .from(TimeSlotEntity)
        .where('id = :id', { id: id })
        .execute();
      return true;
    } else {
      return false;
    }
  }

  async updateTimeSlot(id: string, dto: TimeSlotDTO): Promise<boolean> {
    const timeSlot = await this.timeSlotsRepository.findOne({
      where: { id: id },
    });
    if (timeSlot != null) {
      await this.timeSlotsRepository.update(
        { id: id },
        {
          startTime: dto.startTime,
          endTime: dto.endTime,
          flag: dto.flag,
        },
      );
      return true;
    } else {
      return false;
    }
  }
}