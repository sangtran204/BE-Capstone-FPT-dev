import { AutoMap } from '@automapper/classes';
import { BaseDTO } from 'src/models/base/base.dto';
export class TimeFrameDTO extends BaseDTO {
  @AutoMap()
  name: string;

  @AutoMap()
  dateFilter: number;
}
