import { AutoMap } from '@automapper/classes';
import { SubEnum } from 'src/common/enums/sub.enum';
import { BaseEntity } from 'src/models/base/base.entity';
import { CustomerEntity } from 'src/models/customers/entities/customer.entity';
import { OrderEntity } from 'src/models/orders/entities/order.entity';
import { PackageEntity } from 'src/models/packages/entities/packages.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

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

  @Column({ default: SubEnum.UNCONFIRMED })
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

  @OneToMany(() => OrderEntity, (order) => order.subscription)
  @AutoMap(() => [OrderEntity])
  orders: OrderEntity[];
}
