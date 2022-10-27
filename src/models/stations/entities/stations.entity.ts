import { AutoMap } from '@automapper/classes';
import { StatusEnum } from 'src/common/enums/status.enum';
import { BaseEntity } from 'src/models/base/base.entity';
import { DeliveryTripEntity } from 'src/models/deliveryTrips/entities/deliveryTrip.entity';
import { OrderEntity } from 'src/models/orders/entities/order.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'stations' })
export class StationEntity extends BaseEntity {
  @Column()
  @AutoMap()
  name: string;

  @Column()
  @AutoMap()
  address: string;

  @Column()
  @AutoMap()
  phone: string;

  @Column('time')
  @AutoMap()
  openTime: Date;

  @Column('time')
  @AutoMap()
  closeTime: Date;

  @Column({ default: StatusEnum.ACTIVE })
  @AutoMap()
  status: string;

  @OneToMany(() => OrderEntity, (order) => order.station)
  orders: OrderEntity[];

  @OneToMany(() => DeliveryTripEntity, (deliveryTrip) => deliveryTrip.station)
  deliveryTrips: DeliveryTripEntity[];
}
