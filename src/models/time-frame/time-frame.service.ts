import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { TimeFrameEntity } from './entities/time-frame.entity';

@Injectable()
export class TimeFrameService extends BaseService<TimeFrameEntity> {
  constructor(
    @InjectRepository(TimeFrameEntity)
    private readonly timeFrameRepository: Repository<TimeFrameEntity>,
  ) {
    super(timeFrameRepository);
  }

  async getAll(): Promise<TimeFrameEntity[]> {
    return await this.query();
  }
}
