import { AutoMap } from '@automapper/classes';
import { StatusEnum } from 'src/common/enums/status.enum';
import { BaseEntity } from 'src/models/base/base.entity';
import { CustomerEntity } from 'src/models/customers/entities/customer.entity';
import { PackageEntity } from 'src/models/packages/entities/packages.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'subscriptions' })
export class SubscriptionEntity extends BaseEntity {
  @Column()
  @AutoMap()
  totalPrice: number;

  @Column('date')
  @AutoMap()
  startDelivery: Date;

  @Column('date', { nullable: true })
  @AutoMap()
  cancelDate: Date;

  @Column({ default: StatusEnum.UNCONFIRMED })
  @AutoMap()
  status: string;

  @ManyToOne(() => CustomerEntity, (customer) => customer.subscriptions, {
    nullable: false,
  })
  @AutoMap(() => CustomerEntity)
  customer: CustomerEntity;

  @ManyToOne(() => PackageEntity, (packages) => packages.subscriptions, {
    nullable: false,
  })
  @AutoMap(() => PackageEntity)
  packages: PackageEntity;
}
