import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
}
