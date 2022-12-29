import { AutoMap } from '@automapper/classes';
import { BaseDTO } from 'src/models/base/base.dto';
import { FoodGroupDTO } from 'src/models/food-group/dto/food-group.dto';
// import { PackageDTO } from 'src/models/packages/dto/packages.dto';
// import { TimeFrameDTO } from 'src/models/time-frame/dto/time-frame.dto';

export class PackageItemDTO extends BaseDTO {
  @AutoMap()
  itemCode: number;

  @AutoMap(() => FoodGroupDTO)
  foodGroup: FoodGroupDTO;

  @AutoMap()
  deliveryDate: Date;

  // @AutoMap(() => PackageDTO)
  // packages: PackageDTO;

  // @AutoMap(() => TimeFrameDTO)
  // timeFrame: TimeFrameDTO;
}
