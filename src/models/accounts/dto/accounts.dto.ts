import { AutoMap } from '@automapper/classes';

export class AccountDto {
  @AutoMap()
  username: string;
}
