import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeFrameEntity } from 'src/models/time-frame/entities/time-frame.entity';
import { Repository } from 'typeorm';
import { getDataFrame } from './data';

@Injectable()
export class TimeFrameSeederService {
  constructor(
    @InjectRepository(TimeFrameEntity)
    private readonly timeFrameRepository: Repository<TimeFrameEntity>,
  ) {}
  async createTimeFrame(): Promise<void> {
    const data = getDataFrame();
    const tfPromise: Promise<TimeFrameEntity>[] = [];
    for (const item of data) {
      const itemPromise = this.timeFrameRepository.save(item);
      tfPromise.push(itemPromise);
    }
    return Promise.all(tfPromise)
      .then(() => {
        console.info('create data Frame success');
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
