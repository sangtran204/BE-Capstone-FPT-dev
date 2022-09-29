import { Module } from '@nestjs/common';
import { MySQLDatabaseProviderModule } from 'src/providers/database/mysql/provider.module';
import { Seeder } from './seeder';
import { RolesSeederModule } from './roles/roles.module';
import { AccountsSeederModule } from './accounts/accounts.module';
import { TimeSlotsSeederModule } from './time-slots/time-slots.module';

@Module({
  imports: [
    MySQLDatabaseProviderModule,
    RolesSeederModule,
    AccountsSeederModule,
    TimeSlotsSeederModule,
  ],
  providers: [Seeder],
})
export class SeederModule {}
