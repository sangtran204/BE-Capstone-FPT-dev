import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/models/base/base.entity';
import { DeliveryTripEntity } from 'src/models/deliveryTrips/entities/deliveryTrip.entity';
import { OrderEntity } from 'src/models/orders/entities/order.entity';
import { SessionEntity } from 'src/models/sessions/entities/sessions.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'time_slots' })
export class TimeSlotEntity extends BaseEntity {
  @Column('time')
  @AutoMap()
  startTime: Date;

  @Column('time')
  @AutoMap()
  endTime: Date;

  @Column()
  @AutoMap()
  flag: number;

  @OneToMany(() => OrderEntity, (order) => order.timeSlot)
  @AutoMap(() => [OrderEntity])
  orders: OrderEntity[];

  // @OneToMany(() => DeliveryTripEntity, (deliveryTrip) => deliveryTrip.time_slot)
  // deliveryTrip: DeliveryTripEntity[];

  @OneToMany(() => SessionEntity, (sessions) => sessions.timeSlot)
  sessions: SessionEntity[];
}
