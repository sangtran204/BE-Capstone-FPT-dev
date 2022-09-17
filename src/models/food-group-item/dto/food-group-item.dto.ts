import { AutoMap } from '@automapper/classes';
import { BaseDTO } from 'src/models/base/base.dto';
import { FoodDTO } from 'src/models/foods/dto/food.dto';

export class FoodGroupItemDTO extends BaseDTO {
  @AutoMap(() => FoodDTO)
  food: FoodDTO;
}
