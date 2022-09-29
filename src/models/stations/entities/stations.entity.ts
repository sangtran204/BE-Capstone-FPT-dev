import { AutoMap } from '@automapper/classes';
import { StatusEnum } from 'src/common/enums/status.enum';
import { BaseEntity } from 'src/models/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'stations' })
export class StationEntity extends BaseEntity {
  @Column()
  @AutoMap()
  name: string;

  @Column()
  @AutoMap()
  address: string;

  @Column()
  @AutoMap()
  phone: string;

  @Column('time')
  @AutoMap()
  openTime: Date;

  @Column('time')
  @AutoMap()
  closeTime: Date;

  @Column({ default: StatusEnum.ACTIVE })
  @AutoMap()
  status: string;
}
