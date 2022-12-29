import { BaseEntity } from 'src/models/base/base.entity';
import { DeliveryTripEntity } from 'src/models/deliveryTrips/entities/deliveryTrip.entity';
import { OrderEntity } from 'src/models/orders/entities/order.entity';
import { Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';

@Entity({ name: 'batchs' })
export class BatchEntity extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => DeliveryTripEntity, (deliveryTrip) => deliveryTrip.batchs)
  deliveryTrip: DeliveryTripEntity;

  @OneToMany(() => OrderEntity, (orders) => orders.batch)
  orders: OrderEntity[];
}
