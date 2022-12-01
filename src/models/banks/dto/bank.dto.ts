import { BaseDTO } from '../../base/base.dto';
import { AutoMap } from '@automapper/classes';

export class BankDto extends BaseDTO {
  @AutoMap()
  name: string;
}
