import { AutoMap } from '@automapper/classes';
import { AccountEntity } from 'src/models/accounts/entities/account.entity';
import { BaseEntity } from 'src/models/base/base.entity';
import { FeedBackEntity } from 'src/models/feedback/entities/feedback.entity';
// import { OrderEntity } from 'src/models/orders/entities/order.entity';
import { SubscriptionEntity } from 'src/models/subscriptions/entities/subscription.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'customers' })
export class CustomerEntity extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  @AutoMap()
  address: string;

  @AutoMap(() => AccountEntity)
  @OneToOne(() => AccountEntity, (account) => account.customer, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id' })
  account: AccountEntity;

  @AutoMap(() => [SubscriptionEntity])
  @OneToMany(() => SubscriptionEntity, (subscription) => subscription.customer)
  subscriptions: SubscriptionEntity[];

  @AutoMap(() => [FeedBackEntity])
  @OneToMany(() => FeedBackEntity, (feedback) => feedback.customer)
  feedback: FeedBackEntity[];
}
