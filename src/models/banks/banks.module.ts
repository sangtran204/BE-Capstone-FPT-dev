import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankEntity } from './entities/bank.entity';
import { BanksService } from './banks.service';
import { BanksController } from './banks.controller';
import { BankProfile } from './profiles/bank.profile';

@Module({
  imports: [TypeOrmModule.forFeature([BankEntity])],
  controllers: [BanksController],
  providers: [BanksService, BankProfile],
  exports: [BanksService],
})
export class BanksModule {}
