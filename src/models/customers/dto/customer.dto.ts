import { AutoMap } from '@automapper/classes';
import { AccountDTO } from 'src/models/accounts/dto/accounts.dto';
import { BaseDTO } from 'src/models/base/base.dto';
import { ProfileDTO } from 'src/models/profiles/dto/profile.dto';

export class CustomerDTO extends BaseDTO {
  @AutoMap()
  address: string;

  @AutoMap(() => ProfileDTO)
  profile: ProfileDTO;

  @AutoMap(() => AccountDTO)
  account: AccountDTO;
}
