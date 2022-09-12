import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/models/base/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { StationEntity } from 'src/models/stations/entities/stations.entity';

@Entity({ name: 'delivery_trips' })
export class DeliveryTripEntity extends BaseEntity {
  @Column()
  @AutoMap()
  isActive: string;

  @AutoMap(() => StationEntity)
  @ManyToOne(() => StationEntity, (station) => station.deliveryTrips)
  station: StationEntity;
}
