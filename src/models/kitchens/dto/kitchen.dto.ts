import { AutoMap } from '@automapper/classes';
import { AccountDTO } from 'src/models/accounts/dto/accounts.dto';
import { ProfileDTO } from 'src/models/profiles/dto/profile.dto';
import { BaseDTO } from '../../base/base.dto';

export class KitchenDTO extends BaseDTO {
  @AutoMap()
  address: string;

  @AutoMap(() => ProfileDTO)
  profile: ProfileDTO;

  @AutoMap(() => AccountDTO)
  account: AccountDTO;
}
