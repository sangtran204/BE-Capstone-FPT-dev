import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankEntity } from 'src/models/banks/entities/bank.entity';

import { BankSeederService } from './banks.service';

@Module({
  imports: [TypeOrmModule.forFeature([BankEntity])],
  providers: [BankSeederService],
  exports: [BankSeederService],
})
export class BankSeederModule {}
