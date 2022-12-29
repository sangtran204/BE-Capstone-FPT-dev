import { AutoMap } from '@automapper/classes';
import { BaseDTO } from 'src/models/base/base.dto';
import { FoodGroupDTO } from 'src/models/food-group/dto/food-group.dto';
export class PackageItemDTO extends BaseDTO {
  @AutoMap()
  itemCode: number;

  @AutoMap()
  deliveryDate: Date;

  @AutoMap(() => FoodGroupDTO)
  foodGroup: FoodGroupDTO;
}
