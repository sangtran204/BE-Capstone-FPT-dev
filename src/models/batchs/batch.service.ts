import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BatchEnum } from 'src/common/enums/batch.enum';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { BatchEntity } from './entities/batch.entity';

@Injectable()
export class BatchService extends BaseService<BatchEntity> {
  constructor(
    @InjectRepository(BatchEntity)
    private readonly batchRepository: Repository<BatchEntity>,
  ) {
    super(batchRepository);
  }

  // async createBatch(): Promise<BatchEntity> {
  //   const newBatch = await this.batchRepository.create();
  //   if (newBatch == null || !newBatch)
  //     throw new HttpException('Can not create batch', HttpStatus.BAD_REQUEST);
  //   return newBatch;
  // }
  async getBatchById(id: string): Promise<BatchEntity> {
    const batch = await this.batchRepository.findOne({
      where: { id: id },
      relations: {
        station: true,
        orders: { packageItem: { foodGroup: { foods: true } } },
      },
    });
    if (!batch || batch == null)
      throw new HttpException(`Batch id ${id} not found`, HttpStatus.NOT_FOUND);
    return batch;
  }
  async updateStatusBatch(id: string): Promise<string> {
    let status_update;
    const batchFind = await this.batchRepository.findOne({
      where: { id: id },
    });
    if (!batchFind || batchFind == null)
      throw new HttpException('Batch not found', HttpStatus.BAD_REQUEST);
    if (batchFind.status == BatchEnum.READY) {
      await this.batchRepository.save({ id: id, status: BatchEnum.DELIVERY });
      status_update = BatchEnum.DELIVERY;
    } else if (batchFind.status == BatchEnum.DELIVERY) {
      await this.batchRepository.save({ id: id, status: BatchEnum.ARRIVED });
      status_update = BatchEnum.ARRIVED;
    } else if (
      batchFind.status == BatchEnum.WAITING ||
      batchFind.status == BatchEnum.ARRIVED
    ) {
      status_update = 'can not update';
    }
    return status_update;
  }
}
