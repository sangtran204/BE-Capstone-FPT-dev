import { AutoMap } from '@automapper/classes';
import { BaseDTO } from '../../base/base.dto';

export class TimeSlotDTO extends BaseDTO {
  @AutoMap()
  startTime: Date;

  @AutoMap()
  endTime: Date;

  @AutoMap()
  flag: number;
}
