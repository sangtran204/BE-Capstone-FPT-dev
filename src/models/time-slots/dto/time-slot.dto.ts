import { AutoMap } from '@automapper/classes';
import { BaseDTO } from '../../base/base.dto';

export class TimeSlotDTO extends BaseDTO {
  @AutoMap()
  startTime: string;

  @AutoMap()
  endTime: string;

  @AutoMap()
  flag: number;
}
