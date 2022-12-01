import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BankEntity } from 'src/models/banks/entities/bank.entity';
import { Repository } from 'typeorm';
import { getData } from './data';

@Injectable()
export class BankSeederService {
  constructor(
    @InjectRepository(BankEntity)
    private readonly bankRepository: Repository<BankEntity>,
  ) {}

  async createBank(): Promise<void> {
    const bankPromise: Promise<BankEntity>[] = [];
    const data = getData();
    for (const item of data) {
      bankPromise.push(this.bankRepository.save(item));
    }
    await Promise.all(bankPromise);
    console.info('create Bank successfully');
  }
}
