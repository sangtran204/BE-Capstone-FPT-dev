import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/models/base/base.entity';
import { FoodGroupEntity } from 'src/models/food-group/entities/food-group.entity';
import { PackageEntity } from 'src/models/packages/entities/packages.entity';
import { TimeFrameEntity } from 'src/models/time-frame/entities/time-frame.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

@Entity({ name: 'package_item' })
export class PackageItemEntity extends BaseEntity {
  @Column('date')
  @AutoMap()
  startDate: Date;

  @Column('date')
  @AutoMap()
  endDate: Date;

  @Column()
  @AutoMap()
  maxFood: number;

  @Column()
  @AutoMap()
  maxAmount: string;

  @AutoMap(() => [FoodGroupEntity])
  @ManyToMany(() => FoodGroupEntity, (foodGroup) => foodGroup.packageItem)
  @JoinTable({ name: 'package_item_group' })
  foodGroups: FoodGroupEntity[];

  @AutoMap(() => TimeFrameEntity)
  @ManyToOne(() => TimeFrameEntity, (timeFrame) => timeFrame.packageItem)
  timeFrame: TimeFrameEntity;

  @AutoMap(() => PackageEntity)
  @ManyToOne(() => PackageEntity, (packages) => packages.packageItem)
  packages: PackageEntity;
}
