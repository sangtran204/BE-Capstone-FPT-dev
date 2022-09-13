import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/models/base/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { IsActiveEnum } from 'src/common/enums/isActive.enum';
import { DeliveryTripEntity } from 'src/models/deliveryTrips/entities/deliveryTrip.entity';

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

  @Column()
  @AutoMap()
  openTime: string;

  @Column()
  @AutoMap()
  closeTime: string;

  @Column({ default: IsActiveEnum.ACTIVE })
  @AutoMap()
  isActive: string;

  @OneToMany(() => DeliveryTripEntity, (deliveryTrip) => deliveryTrip.station)
  deliveryTrips: DeliveryTripEntity[];
}
