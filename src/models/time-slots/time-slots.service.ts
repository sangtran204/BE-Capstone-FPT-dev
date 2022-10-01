import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../base/base.service';
import { TimeSlotEntity } from './entities/time-slots.entity';

@Injectable()
export class TimeSlotsService extends BaseService<TimeSlotEntity> {
  constructor(
    @InjectRepository(TimeSlotEntity)
    private readonly timeSlotsRepository: Repository<TimeSlotEntity>,
  ) {
    super(timeSlotsRepository);
  }
}
