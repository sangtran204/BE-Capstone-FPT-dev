import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/models/base/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
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

  @ManyToOne(() => TimeSlotEntity, (timeSlot) => timeSlot.meal)
  timeSlots: TimeSlotEntity;
}
