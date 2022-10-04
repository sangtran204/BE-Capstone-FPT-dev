import { AutoMap } from '@automapper/classes';
import { CustomerDTO } from 'src/models/customers/dto/customer.dto';
import { PackageDTO } from 'src/models/packages/dto/packages.dto';
import { BaseDTO } from '../../base/base.dto';

export class OrderDTO extends BaseDTO {
  @AutoMap()
  totalPrice: number;

  @AutoMap()
  startDelivery: Date;

  @AutoMap()
  endDelivery: Date;

  @AutoMap()
  status: string;

  @AutoMap(() => CustomerDTO)
  customer: CustomerDTO;

  @AutoMap(() => PackageDTO)
  tour: PackageDTO;
}
