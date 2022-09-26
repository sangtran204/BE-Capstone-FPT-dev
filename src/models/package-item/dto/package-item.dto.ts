import { AutoMap } from '@automapper/classes';
import { BaseDTO } from 'src/models/base/base.dto';
import { FoodGroupDTO } from 'src/models/food-group/dto/food-group.dto';

export class PackageItemDTO extends BaseDTO {
  @AutoMap()
  startDate: Date;

  @AutoMap()
  endDate: Date;

  @AutoMap()
  maxFood: number;

  @AutoMap()
  maxAmount: string;

  @AutoMap(() => [FoodGroupDTO])
  foodGroups: FoodGroupDTO[];
}
