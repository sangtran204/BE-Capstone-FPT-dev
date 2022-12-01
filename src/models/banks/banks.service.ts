import { Injectable } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { BankEntity } from './entities/bank.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BanksService extends BaseService<BankEntity> {
  constructor(
    @InjectRepository(BankEntity)
    private readonly banksRepository: Repository<BankEntity>,
  ) {
    super(banksRepository);
  }
}
