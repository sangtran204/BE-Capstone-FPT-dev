import { AutoMap } from '@automapper/classes';
import { BaseDTO } from 'src/models/base/base.dto';

export class ShipperInfoDTO extends BaseDTO {
  @AutoMap()
  noPlate: string;

  @AutoMap()
  vehicleType: string;

  @AutoMap()
  status: string;
}
