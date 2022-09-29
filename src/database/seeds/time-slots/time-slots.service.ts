import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeSlotEntity } from 'src/models/time-slots/entities/time-slots.entity';
import { Repository } from 'typeorm';
import { getDataTimeSlot } from './data';

@Injectable()
export class TimeSlotsSeederService {
  constructor(
    @InjectRepository(TimeSlotEntity)
    private readonly timeSlotRepository: Repository<TimeSlotEntity>,
  ) {}
  async createTimeSlot(): Promise<void> {
    const data = getDataTimeSlot();
    const tsPromise: Promise<TimeSlotEntity>[] = [];
    for (const item of data) {
      const itemPromise = this.timeSlotRepository.save(item);
      tsPromise.push(itemPromise);
    }
    return Promise.all(tsPromise)
      .then(() => {
        console.info('create data timeSlot success');
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
