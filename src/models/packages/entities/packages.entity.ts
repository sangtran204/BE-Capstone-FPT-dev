import { AutoMap } from '@automapper/classes';
import { PackageEnum } from 'src/common/enums/package.enum';
import { BaseEntity } from 'src/models/base/base.entity';
import { PackageCategoryEntity } from 'src/models/package-categories/entities/package-categories.entity';
import { PackageItemEntity } from 'src/models/package-item/entities/package-item.entity';
import { SubscriptionEntity } from 'src/models/subscriptions/entities/subscription.entity';
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
  totalMeal: number;

  @Column({ default: PackageEnum.WAITING })
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
}
