import { Repository } from 'typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../base/base.service';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { FeedBackEntity } from './entities/feedback.entity';

@Injectable()
export class FeedBackService extends BaseService<FeedBackEntity> {
  constructor(
    @InjectRepository(FeedBackEntity)
    private readonly feedbackRepository: Repository<FeedBackEntity>,
    @InjectMapper() private readonly mapper: Mapper,
  ) {
    super(feedbackRepository);
  }
}
