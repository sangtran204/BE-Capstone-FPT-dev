import { AutoMap } from '@automapper/classes';
import { AccountEntity } from 'src/models/accounts/entities/account.entity';
import { BaseEntity } from 'src/models/base/base.entity';
import { DeliveryTripEntity } from 'src/models/deliveryTrips/entities/deliveryTrip.entity';
import { OrderEntity } from 'src/models/orders/entities/order.entity';
import { RequestEntity } from 'src/models/request/entities/request.entity';
import { ShipperEntity } from 'src/models/shippers/entities/shipper.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'kitchens' })
export class KitchenEntity extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  @AutoMap()
  address: string;

  @Column()
  @AutoMap()
  ability: string;

  // @AutoMap(() => AccountEntity)
  @OneToOne(() => AccountEntity, (account) => account.kitchen, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id' })
  account: AccountEntity;

  @AutoMap(() => [ShipperEntity])
  @OneToMany(() => ShipperEntity, (shipper) => shipper.kitchen)
  shippers: ShipperEntity[];

  @OneToMany(() => OrderEntity, (order) => order.kitchen)
  orders: OrderEntity[];

  @OneToMany(() => DeliveryTripEntity, (deliveryTrips) => deliveryTrips.kitchen)
  deliveryTrips: DeliveryTripEntity[];

  @OneToMany(() => RequestEntity, (request) => request.kitchen)
  request: RequestEntity[];
}
