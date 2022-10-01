import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/models/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'time_slots' })
export class TimeSlotEntity extends BaseEntity {
  @Column('time')
  @AutoMap()
  startTime: Date;

  @Column('time')
  @AutoMap()
  endTime: Date;

  @Column()
  @AutoMap()
  flag: number;
}
