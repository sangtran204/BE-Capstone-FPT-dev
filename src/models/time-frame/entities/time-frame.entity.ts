import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/models/base/base.entity';
import { PackageEntity } from 'src/models/packages/entities/packages.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'time_frame' })
export class TimeFrameEntity extends BaseEntity {
  @Column()
  @AutoMap()
  name: string;

  @Column()
  @AutoMap()
  dateFilter: number;

  @OneToMany(() => PackageEntity, (packages) => packages.timeFrame)
  packages: PackageEntity[];
}
