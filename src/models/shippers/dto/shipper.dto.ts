import { AutoMap } from '@automapper/classes';
import { AccountDTO } from 'src/models/accounts/dto/accounts.dto';
import { BaseDTO } from 'src/models/base/base.dto';
import { KitchenDTO } from 'src/models/kitchens/dto/kitchen.dto';
import { ProfileDTO } from 'src/models/profiles/dto/profile.dto';

export class ShipperDTO extends BaseDTO {
  @AutoMap()
  noPlate: string;

  @AutoMap()
  vehicleType: string;

  @AutoMap()
  status: string;

  @AutoMap(() => ProfileDTO)
  profile: ProfileDTO;

  @AutoMap(() => AccountDTO)
  account: AccountDTO;

  @AutoMap(() => KitchenDTO)
  kitchen: KitchenDTO;
}
