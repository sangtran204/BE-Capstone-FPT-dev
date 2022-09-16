import { AutoMap } from '@automapper/classes';
import { FoodCategoryDTO } from 'src/models/food-categories/dto/food-category.dto';
import { BaseDTO } from '../../base/base.dto';
export class FoodDTO extends BaseDTO {
  @AutoMap()
  name: string;

  @AutoMap()
  description: string;

  @AutoMap()
  price: number;

  @AutoMap()
  image: string;

  @AutoMap()
  isActive: string;

  @AutoMap(() => FoodCategoryDTO)
  foodCategory: FoodCategoryDTO;
}
