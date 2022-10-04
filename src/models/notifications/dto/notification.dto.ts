import { BaseDTO } from '../../base/base.dto';
import { AutoMap } from '@automapper/classes';

export class NotificationDto extends BaseDTO {
  @AutoMap()
  title: string;

  @AutoMap()
  body: string;

  @AutoMap()
  data: string;

  @AutoMap()
  status: string;

  @AutoMap()
  type: string;
}
