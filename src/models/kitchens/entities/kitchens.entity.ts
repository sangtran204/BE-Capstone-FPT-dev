import { AutoMap } from '@automapper/classes';
import { IsNotEmpty } from 'class-validator';
import { BaseEntity } from 'src/models/base/base.entity';
import { Column, Entity } from 'typeorm';
import { StatusEnum } from 'src/common/enums/status.enum';

@Entity({ name: 'kitchens' })
export class KitchenEntity extends BaseEntity {
  @Column()
  @AutoMap()
  @IsNotEmpty()
  name: string;

  @Column()
  @AutoMap()
  @IsNotEmpty()
  address: string;

  @Column({ length: 10 })
  @AutoMap()
  @IsNotEmpty()
  phone: string;

  @Column({ default: StatusEnum.ACTIVE })
  @AutoMap()
  status: string;

  // @OneToMany(() => ShipperEntity, (shipper) => shipper.kitchen)
  // shippers: ShipperEntity[];

  // @OneToMany(() => DeliveryTripEntity, (deliveryTrip) => deliveryTrip.kitchen)
  // deliveryTrips: DeliveryTripEntity[];
}
