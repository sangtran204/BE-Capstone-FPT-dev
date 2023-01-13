import { AutoMap } from '@automapper/classes';
import { SubEnum } from 'src/common/enums/sub.enum';
import { AccountEntity } from 'src/models/accounts/entities/account.entity';
import { BaseEntity } from 'src/models/base/base.entity';
import { FeedBackEntity } from 'src/models/feedback/entities/feedback.entity';
import { OrderEntity } from 'src/models/orders/entities/order.entity';
import { PackageEntity } from 'src/models/packages/entities/packages.entity';
import { PaymentEntity } from 'src/models/payment/entities/payment.entity';
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';

@Entity({ name: 'subscriptions' })
export class SubscriptionEntity extends BaseEntity {
  @Column()
  @AutoMap()
  totalPrice: number;

  @Column('date')
  @AutoMap()
  subscriptionDate: Date;

  @Column({ default: SubEnum.UNCONFIRMED })
  @AutoMap()
  status: string;

  @ManyToOne(() => AccountEntity, (account) => account.subscriptions, {
    nullable: false,
  })
  @AutoMap(() => AccountEntity)
  account: AccountEntity;

  @ManyToOne(() => PackageEntity, (packages) => packages.subscriptions, {
    nullable: false,
  })
  @AutoMap(() => PackageEntity)
  packages: PackageEntity;

  @OneToMany(() => OrderEntity, (order) => order.subscription)
  @AutoMap(() => [OrderEntity])
  orders: OrderEntity[];

  @OneToOne(() => PaymentEntity, (payment) => payment.subscription)
  payment: PaymentEntity;

  @OneToOne(() => FeedBackEntity, (feedback) => feedback.subscription)
  feedback: FeedBackEntity;
}
