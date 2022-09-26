import { AutoMap } from '@automapper/classes';
import { StatusEnum } from 'src/common/enums/status.enum';
import { BaseEntity } from 'src/models/base/base.entity';
import { PackageItemEntity } from 'src/models/package-item/entities/package-item.entity';
import { TimeFrameEntity } from 'src/models/time-frame/entities/time-frame.entity';
import { Column, Entity, OneToMany } from 'typeorm';

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
  price: string;

  @Column()
  @AutoMap()
  totalDate: number;

  @Column()
  @AutoMap()
  totalFood: number;

  @Column()
  @AutoMap()
  totalMeal: number;

  @Column()
  @AutoMap()
  totalStation: number;

  @Column({ default: StatusEnum.WAITING })
  @AutoMap()
  status: string;

  @OneToMany(() => PackageItemEntity, (packageItems) => packageItems.packages)
  packageItem: PackageItemEntity[];

  @OneToMany(() => TimeFrameEntity, (timeFrame) => timeFrame.packages)
  timeFrame: TimeFrameEntity[];
}
