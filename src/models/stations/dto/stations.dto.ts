import { AutoMap } from '@automapper/classes';
import { BaseDTO } from '../../base/base.dto';

export class StationDTO extends BaseDTO {
  @AutoMap()
  name: string;

  @AutoMap()
  address: string;

  @AutoMap()
  phone: string;

  @AutoMap()
  openTime: Date;

  @AutoMap()
  closeTime: Date;

  @AutoMap()
  status: string;
}
