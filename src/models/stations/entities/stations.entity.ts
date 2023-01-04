import { AutoMap } from '@automapper/classes';
import { StatusEnum } from 'src/common/enums/status.enum';
import { GeometryTransformer } from 'src/common/types/geometryTransformer';
import { BaseEntity } from 'src/models/base/base.entity';
import { BatchEntity } from 'src/models/batchs/entities/batch.entity';
import { DeliveryTripEntity } from 'src/models/deliveryTrips/entities/deliveryTrip.entity';
import { KitchenEntity } from 'src/models/kitchens/entities/kitchens.entity';
import { OrderEntity } from 'src/models/orders/entities/order.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Point } from 'geojson';

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

  @Column({
    name: 'Coordinate',
    type: 'geometry',
    spatialFeatureType: 'Point',
    transformer: new GeometryTransformer(),
  })
  coordinate: Point;

  @Column({ default: StatusEnum.ACTIVE })
  @AutoMap()
  status: string;

  @OneToMany(() => OrderEntity, (order) => order.station)
  orders: OrderEntity[];

  // @OneToMany(() => DeliveryTripEntity, (deliveryTrip) => deliveryTrip.station)
  // deliveryTrips: DeliveryTripEntity[];

  @ManyToOne(() => KitchenEntity, (kitchen) => kitchen.stations)
  kitchen: KitchenEntity;

  @OneToMany(() => BatchEntity, (batchs) => batchs.station)
  batchs: BatchEntity[];
}
