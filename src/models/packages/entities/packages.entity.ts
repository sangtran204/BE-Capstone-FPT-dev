import { AutoMap } from '@automapper/classes';
import { StatusEnum } from 'src/common/enums/status.enum';
import { BaseEntity } from 'src/models/base/base.entity';
import { FeedBackEntity } from 'src/models/feedback/entities/feedback.entity';
import { PackageCategoryEntity } from 'src/models/package-categories/entities/package-categories.entity';
import { PackageItemEntity } from 'src/models/package-item/entities/package-item.entity';
import { SubscriptionEntity } from 'src/models/subscriptions/entities/subscription.entity';
import { TimeFrameEntity } from 'src/models/time-frame/entities/time-frame.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'packages' })
export class PackageEntity extends BaseEntity {
  @Column('datetime')
  @AutoMap()
  startSale: Date;

  @Column('datetime')
  @AutoMap()
  endSale: Date;

  @Column()
  @AutoMap()
  name: string;

  @Column()
  @AutoMap()
  description: string;

  @Column()
  @AutoMap()
  price: number;

  @Column()
  @AutoMap()
  image: string;

  @Column()
  @AutoMap()
  totalDate: number;

  @Column()
  @AutoMap()
  totalFood: number;

  @Column()
  @AutoMap()
  totalMeal: number;

  // @Column()
  // @AutoMap()
  // totalStation: number;

  @Column({ default: StatusEnum.WAITING })
  @AutoMap()
  status: string;

  @AutoMap(() => [PackageItemEntity])
  @OneToMany(() => PackageItemEntity, (packageItem) => packageItem.packages)
  packageItem: PackageItemEntity[];

  // @AutoMap(() => TimeFrameEntity)
  // @ManyToOne(() => TimeFrameEntity, (timeFrame) => timeFrame.packages)
  // timeFrame: TimeFrameEntity;

  @OneToMany(
    () => SubscriptionEntity,
    (subscriptions) => subscriptions.packages,
  )
  subscriptions: SubscriptionEntity[];

  @AutoMap(() => PackageCategoryEntity)
  @ManyToOne(
    () => PackageCategoryEntity,
    (packageCategory) => packageCategory.packages,
  )
  packageCategory: PackageCategoryEntity;

  @AutoMap(() => [FeedBackEntity])
  @OneToMany(() => FeedBackEntity, (feedback) => feedback.packages)
  feedback: FeedBackEntity[];
}
