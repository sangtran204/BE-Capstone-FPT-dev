import { AutoMap } from '@automapper/classes';
import { BaseDTO } from 'src/models/base/base.dto';
import { FoodGroupDTO } from 'src/models/food-group/dto/food-group.dto';
import { PackageDTO } from 'src/models/packages/dto/packages.dto';

export class PackageItemDTO extends BaseDTO {
  @AutoMap()
  maxAmount: number;

  @AutoMap(() => FoodGroupDTO)
  foodGroup: FoodGroupDTO;

  @AutoMap(() => PackageDTO)
  packages: PackageDTO;
}
