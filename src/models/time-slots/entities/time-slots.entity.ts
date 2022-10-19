import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/models/base/base.entity';
import { OrderEntity } from 'src/models/orders/entities/order.entity';
import { Column, Entity, OneToMany } from 'typeorm';

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

  @OneToMany(() => OrderEntity, (order) => order.timeSlot)
  @AutoMap(() => [OrderEntity])
  orders: OrderEntity[];
}
