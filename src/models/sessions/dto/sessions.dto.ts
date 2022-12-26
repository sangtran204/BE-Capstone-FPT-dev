import { AutoMap } from '@automapper/classes';
import { BaseDTO } from 'src/models/base/base.dto';
import { DeliveryTripDTO } from 'src/models/deliveryTrips/dto/deliveryTrip.dto';
import { KitchenDTO } from 'src/models/kitchens/dto/kitchen.dto';
import { OrderDTO } from 'src/models/orders/dto/order.dto';
import { ShipperDTO } from 'src/models/shippers/dto/shipper.dto';
import { TimeSlotDTO } from 'src/models/time-slots/dto/time-slot.dto';

export class SessionDTO extends BaseDTO {
  @AutoMap()
  workDate: Date;

  @AutoMap()
  status: string;

  @AutoMap(() => [OrderDTO])
  orders: OrderDTO[];

  @AutoMap(() => [DeliveryTripDTO])
  deliveryTrips: DeliveryTripDTO[];

  @AutoMap(() => TimeSlotDTO)
  timeSlot: TimeSlotDTO;

  @AutoMap(() => KitchenDTO)
  kitchen: KitchenDTO;

  @AutoMap(() => [ShipperDTO])
  shippers: ShipperDTO[];
}
