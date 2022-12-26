import { AutoMap } from '@automapper/classes';
import { BaseDTO } from 'src/models/base/base.dto';
import { DeliveryTripDTO } from 'src/models/deliveryTrips/dto/deliveryTrip.dto';
import { OrderDTO } from 'src/models/orders/dto/order.dto';

export class BatchDTO extends BaseDTO {
  @AutoMap(() => DeliveryTripDTO)
  deliveryTrip: DeliveryTripDTO;

  @AutoMap(() => OrderDTO)
  orders: OrderDTO[];
}
