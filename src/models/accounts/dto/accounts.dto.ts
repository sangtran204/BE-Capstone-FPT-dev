import { AutoMap } from '@automapper/classes';

export class AccountDTO {
  @AutoMap()
  phone: string;
}
