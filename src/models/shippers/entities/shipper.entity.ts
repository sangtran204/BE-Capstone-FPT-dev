import { AutoMap } from '@automapper/classes';
import { AccountEntity } from 'src/models/accounts/entities/account.entity';
import { BaseEntity } from 'src/models/base/base.entity';
import { DeliveryTripEntity } from 'src/models/deliveryTrips/entities/deliveryTrip.entity';
import { KitchenEntity } from 'src/models/kitchens/entities/kitchens.entity';
import { SessionEntity } from 'src/models/sessions/entities/sessions.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'shippers' })
export class ShipperEntity extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  @AutoMap()
  noPlate: string;

  @Column()
  @AutoMap()
  vehicleType: string;

  @Column()
  @AutoMap()
  status: string;

  @AutoMap(() => AccountEntity)
  @OneToOne(() => AccountEntity, (account) => account.shipper, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id' })
  account: AccountEntity;

  @OneToMany(() => DeliveryTripEntity, (deliveryTrips) => deliveryTrips.shipper)
  deliveryTrips: DeliveryTripEntity[];

  @ManyToOne(() => KitchenEntity, (kitchen) => kitchen.shippers)
  kitchen: KitchenEntity;

  @ManyToMany(() => SessionEntity, (sessions) => sessions.shippers)
  sessions: SessionEntity[];
}
