import { AutoMap } from '@automapper/classes';
import { BatchEnum } from 'src/common/enums/batch.enum';
import { BaseEntity } from 'src/models/base/base.entity';
import { DeliveryTripEntity } from 'src/models/deliveryTrips/entities/deliveryTrip.entity';
import { OrderEntity } from 'src/models/orders/entities/order.entity';
import { SessionEntity } from 'src/models/sessions/entities/sessions.entity';
import { StationEntity } from 'src/models/stations/entities/stations.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';

@Entity({ name: 'batchs' })
export class BatchEntity extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column({ default: BatchEnum.WAITING })
  @AutoMap()
  status: string;

  @ManyToOne(() => StationEntity, (station) => station.batchs)
  station: StationEntity;

  @ManyToOne(() => DeliveryTripEntity, (deliveryTrip) => deliveryTrip.batchs)
  deliveryTrip: DeliveryTripEntity;

  @ManyToOne(() => SessionEntity, (session) => session.batchs)
  session: SessionEntity;

  @OneToMany(() => OrderEntity, (orders) => orders.batch)
  orders: OrderEntity[];
}
