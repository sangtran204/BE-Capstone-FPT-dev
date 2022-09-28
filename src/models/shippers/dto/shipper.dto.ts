import { AutoMap } from '@automapper/classes';
import { BaseDTO } from 'src/models/base/base.dto';
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
}
