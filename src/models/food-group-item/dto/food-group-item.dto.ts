import { AutoMap } from '@automapper/classes';
import { BaseDTO } from 'src/models/base/base.dto';
import { FoodGroupDTO } from 'src/models/food-group/dto/food-group.dto';
import { FoodDTO } from 'src/models/foods/dto/food.dto';

export class FoodGroupItemDTO extends BaseDTO {
  @AutoMap(() => FoodDTO)
  food: FoodDTO;

  @AutoMap(() => FoodGroupDTO)
  foodGroup: FoodGroupDTO;
}
