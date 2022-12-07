import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { UpdateTimeFrameDTO } from './dto/update-frame.dto';
import { TimeFrameEntity } from './entities/time-frame.entity';

@Injectable()
export class TimeFrameService extends BaseService<TimeFrameEntity> {
  constructor(
    @InjectRepository(TimeFrameEntity)
    private readonly timeFrameRepository: Repository<TimeFrameEntity>,
  ) {
    super(timeFrameRepository);
  }

  async updateTimeFrame(id: string, data: UpdateTimeFrameDTO): Promise<string> {
    const frame = await this.timeFrameRepository.findOne({
      where: { id: id },
    });

    if (!frame) {
      throw new HttpException(`${id} frame not found`, HttpStatus.NOT_FOUND);
    }

    await this.save({
      id: id,
      name: data.name,
      dateFilter: data.dateFilter,
    });

    return `Update Time Frame Successfully ${id}`;
  }

  async deleteTimeFrame(id: string): Promise<string> {
    try {
      const frame = await this.timeFrameRepository.findOne({
        where: { id: id },
      });
      if (!frame) {
        return 'Time frame not found';
      } else {
        await this.deleteById(id);
        return `Delete Successfully`;
      }
    } catch (error) {
      throw new HttpException(
        'Cannot delete (Get Foreign Key)',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
