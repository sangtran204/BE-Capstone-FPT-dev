import { AutoMap } from '@automapper/classes';

export class OrderDetailRes {
  @AutoMap()
  id: string;

  @AutoMap()
  nameFood: string;

  @AutoMap()
  startTime: string;

  @AutoMap()
  endTime: string;

  @AutoMap()
  station: string;

  @AutoMap()
  phone: string;

  @AutoMap()
  fullName: string;

  @AutoMap()
  deliveryDate: Date;

  @AutoMap()
  orderDate: Date;
}
