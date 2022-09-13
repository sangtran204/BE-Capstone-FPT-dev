import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/models/base/base.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { TimeSlotEntity } from 'src/models/timeSlots/entities/timeSlots.entity';
import { IsActiveEnum } from 'src/common/enums/isActive.enum';

@Entity({ name: 'meals' })
export class MealEntity extends BaseEntity {
  @Column()
  @AutoMap()
  dateOfMeal: string;

  @Column({ default: IsActiveEnum.WAITING })
  @AutoMap()
  isActive: string;

  @OneToOne(() => TimeSlotEntity, (timeSlot) => timeSlot.meal)
  @JoinColumn({ name: 'timeSlotId' })
  timeSlots: TimeSlotEntity;
}
