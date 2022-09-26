import { AutoMap } from '@automapper/classes';
import { BaseDTO } from 'src/models/base/base.dto';

export class TimeFrameDTO extends BaseDTO {
  @AutoMap()
  startDelivery: Date;

  @AutoMap()
  endDelivery: Date;

  @AutoMap()
  dateFilter: string;
}
