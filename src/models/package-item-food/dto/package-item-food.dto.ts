import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from 'src/models/base/base.dto';
import { FoodGroupDTO } from 'src/models/food-group/dto/food-group.dto';

export class PackageItemFoodDTO extends BaseDTO {
  @ApiProperty()
  @AutoMap()
  maxFood: number;

  @AutoMap(() => FoodGroupDTO)
  foodGroup: FoodGroupDTO;
}
