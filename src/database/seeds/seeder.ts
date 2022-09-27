import { Injectable } from '@nestjs/common';
import { AccountsSeederService } from './accounts/accounts.service';
import { RolesSeederService } from './roles/roles.service';

@Injectable()
export class Seeder {
  constructor(
    private readonly roleService: RolesSeederService,
    private readonly accountService: AccountsSeederService,
  ) {}

  async insertRoles(): Promise<void> {
    return await this.roleService.createRole();
  }

  async insertAccount(): Promise<void> {
    return await this.accountService.addData();
  }
}
