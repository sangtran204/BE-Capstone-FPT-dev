import { Injectable } from '@nestjs/common';
import { AccountsSeederService } from './accounts/accounts.service';
import { BankSeederService } from './banks/banks.service';
import { RolesSeederService } from './roles/roles.service';
// import { TimeFrameSeederService } from './time-frame/time-frame.service';
import { TimeSlotsSeederService } from './time-slots/time-slots.service';

@Injectable()
export class Seeder {
  constructor(
    private readonly roleService: RolesSeederService,
    private readonly accountService: AccountsSeederService,
    private readonly timeSlotService: TimeSlotsSeederService,
    // private readonly timeFrameService: TimeFrameSeederService,
    private readonly bankService: BankSeederService,
  ) {}

  async insertRoles(): Promise<void> {
    return await this.roleService.createRole();
  }

  async insertAccount(): Promise<void> {
    return await this.accountService.addData();
  }

  async insertTimeSlot(): Promise<void> {
    return await this.timeSlotService.createTimeSlot();
  }

  // async insertTimeFrame(): Promise<void> {
  //   return await this.timeFrameService.createTimeFrame();
  // }

  async insertBank(): Promise<void> {
    return await this.bankService.createBank();
  }
}
