import { AutoMap } from '@automapper/classes';
import { CustomerDTO } from 'src/models/customers/dto/customer.dto';
import { FoodDTO } from 'src/models/foods/dto/food.dto';
import { PackageItemDTO } from 'src/models/package-item/dto/package-item.dto';
import { PackageDTO } from 'src/models/packages/dto/packages.dto';
import { StationDTO } from 'src/models/stations/dto/stations.dto';
import { SubscriptionDTO } from 'src/models/subscriptions/dto/subscription.dto';
import { BaseDTO } from '../../base/base.dto';

export class OrderDTO extends BaseDTO {
  @AutoMap()
  deliveryDate: Date;

  @AutoMap()
  deliveryTime: Date;

  @AutoMap()
  priceFood: number;

  @AutoMap()
  nameFood: number;

  @AutoMap()
  status: string;

  @AutoMap(() => SubscriptionDTO)
  subscription: SubscriptionDTO;

  @AutoMap(() => PackageItemDTO)
  packageItem: PackageItemDTO;

  @AutoMap(() => FoodDTO)
  food: FoodDTO;

  @AutoMap(() => StationDTO)
  station: StationDTO;
}
