import { AutoMap } from '@automapper/classes';
import { BaseDTO } from '../../base/base.dto';
import { CustomerDTO } from 'src/models/customers/dto/customer.dto';
import { PackageDTO } from 'src/models/packages/dto/packages.dto';

export class SubscriptionDTO extends BaseDTO {
  @AutoMap()
  totalPrice: number;

  @AutoMap()
  startDelivery: Date;

  @AutoMap()
  cancelDate: Date;

  @AutoMap()
  status: string;

  @AutoMap(() => CustomerDTO)
  customer: CustomerDTO;

  @AutoMap(() => PackageDTO)
  package: PackageDTO;
}
