import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/models/base/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { StationEntity } from 'src/models/stations/entities/stations.entity';
// import { KitchenEntity } from 'src/models/kitchens/entities/kitchens.entity';
import { ShipperEntity } from 'src/models/shippers/entities/shipper.entity';
import { OrderEntity } from 'src/models/orders/entities/order.entity';
// import { TimeSlotEntity } from 'src/models/time-slots/entities/time-slots.entity';
import { SessionEntity } from 'src/models/sessions/entities/sessions.entity';
import { BatchEntity } from 'src/models/batchs/entities/batch.entity';
import { DeliveryTripEnum } from 'src/common/enums/deliveryTrip.enum';

@Entity({ name: 'delivery_trips' })
export class DeliveryTripEntity extends BaseEntity {
  @Column('time', { nullable: true })
  @AutoMap()
  deliveryTime: Date;

  @Column('time', { nullable: true })
  @AutoMap()
  arrivedTime: Date;

  @Column('date')
  @AutoMap()
  deliveryDate: Date;

  @Column({ default: DeliveryTripEnum.WAITING })
  @AutoMap()
  status: string;

  // @AutoMap(() => StationEntity)
  // @ManyToOne(() => StationEntity, (stations) => stations.deliveryTrip)
  // station: StationEntity[];

  @AutoMap(() => ShipperEntity)
  @ManyToOne(() => ShipperEntity, (shipper) => shipper.deliveryTrips)
  shipper: ShipperEntity;

  // @OneToMany(() => OrderEntity, (order) => order.deliveryTrips)
  // order: OrderEntity[];

  @ManyToOne(() => SessionEntity, (session) => session.deliveryTrips)
  session: SessionEntity;

  @OneToMany(() => BatchEntity, (batchs) => batchs.deliveryTrip)
  batchs: BatchEntity[];
}
