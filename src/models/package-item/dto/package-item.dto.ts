import { AutoMap } from '@automapper/classes';
import { BaseDTO } from 'src/models/base/base.dto';
import { FoodGroupDTO } from 'src/models/food-group/dto/food-group.dto';

export class PackageItemDTO extends BaseDTO {
  @AutoMap()
  deliveryDate: Date;

  @AutoMap()
  maxFood: number;

  @AutoMap()
  totalGroup: number;

  @AutoMap(() => [FoodGroupDTO])
  foodGroups: FoodGroupDTO[];
}
