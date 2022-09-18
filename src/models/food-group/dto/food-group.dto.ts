import { AutoMap } from '@automapper/classes';
import { BaseDTO } from '../../base/base.dto';

export class FoodGroupDTO extends BaseDTO {
  @AutoMap()
  name: string;

  @AutoMap()
  description: string;

  @AutoMap()
  totalFood: number;

  @AutoMap()
  image: string;

  @AutoMap()
  isActive: string;
}
