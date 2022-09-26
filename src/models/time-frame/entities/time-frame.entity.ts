import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/models/base/base.entity';
import { PackageItemEntity } from 'src/models/package-item/entities/package-item.entity';
import { PackageEntity } from 'src/models/packages/entities/packages.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'time_frame' })
export class TimeFrameEntity extends BaseEntity {
  @Column('date')
  @AutoMap()
  startDelivery: Date;

  @Column('date')
  @AutoMap()
  endDelivery: Date;

  @Column()
  @AutoMap()
  dateFilter: string;

  @AutoMap(() => PackageItemEntity)
  @OneToMany(() => PackageItemEntity, (packageItem) => packageItem.timeFrame)
  packageItem: PackageItemEntity[];

  @AutoMap(() => PackageEntity)
  @ManyToOne(() => PackageEntity, (packages) => packages.timeFrame)
  packages: PackageEntity;
}
