import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AccountEntity } from 'src/models/accounts/entities/account.entity';
import { AccountsSeederService } from './accounts.service';
@Module({
  imports: [TypeOrmModule.forFeature([AccountEntity])],
  providers: [AccountsSeederService],
  exports: [AccountsSeederService],
})
export class AccountsSeederModule {}
