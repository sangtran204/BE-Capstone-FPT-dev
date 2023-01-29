import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/models/base/base.entity';
import { SubscriptionEntity } from 'src/models/subscriptions/entities/subscription.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity({ name: 'feedback' })
export class FeedBackEntity extends BaseEntity {
  @Column()
  @AutoMap()
  packageRate: number;

  // @Column()
  // @AutoMap()
  // foodRate: number;

  @Column()
  @AutoMap()
  deliveryRate: number;

  @Column()
  @AutoMap()
  comment: string;

  @OneToOne(() => SubscriptionEntity, (subscription) => subscription.feedback)
  @JoinColumn({ name: 'id' })
  subscription: SubscriptionEntity;
}
