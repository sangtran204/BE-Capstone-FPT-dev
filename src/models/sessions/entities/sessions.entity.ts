import { AutoMap } from '@automapper/classes';
import { SessionEnum } from 'src/common/enums/session.enum';
import { BaseEntity } from 'src/models/base/base.entity';
import { BatchEntity } from 'src/models/batchs/entities/batch.entity';
import { DeliveryTripEntity } from 'src/models/deliveryTrips/entities/deliveryTrip.entity';
import { KitchenEntity } from 'src/models/kitchens/entities/kitchens.entity';
import { OrderEntity } from 'src/models/orders/entities/order.entity';
import { ShipperEntity } from 'src/models/shippers/entities/shipper.entity';
import { TimeSlotEntity } from 'src/models/time-slots/entities/time-slots.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'sessions' })
export class SessionEntity extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column('date')
  @AutoMap()
  workDate: Date;

  @Column({ default: SessionEnum.WAITING })
  @AutoMap()
  status: string;

  // @OneToMany(() => OrderEntity, (orders) => orders.session)
  // orders: OrderEntity[];

  @OneToMany(() => DeliveryTripEntity, (deliveryTrips) => deliveryTrips.session)
  deliveryTrips: DeliveryTripEntity[];

  @ManyToOne(() => TimeSlotEntity, (timeSlot) => timeSlot.sessions)
  timeSlot: TimeSlotEntity;

  @OneToMany(() => BatchEntity, (batchs) => batchs.session)
  batchs: BatchEntity[];

  @ManyToOne(() => KitchenEntity, (kitchen) => kitchen.sessions)
  kitchen: KitchenEntity;

  @AutoMap(() => [ShipperEntity])
  @ManyToMany(() => ShipperEntity, (shippers) => shippers.sessions)
  @JoinTable({ name: 'shipper_session' })
  shippers: ShipperEntity[];
}
