import { AutoMap } from '@automapper/classes';
import { IsActiveEnum } from 'src/common/enums/isActive.enum';
import { BaseEntity } from 'src/models/base/base.entity';
import { FoodEntity } from 'src/models/foods/entities/foods.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

@Entity({ name: 'food_group' })
export class FoodGroupEntity extends BaseEntity {
  @Column()
  @AutoMap()
  name: string;

  @Column()
  @AutoMap()
  description: string;

  @Column()
  @AutoMap()
  totalFood: number;

  @Column()
  @AutoMap()
  image: string;

  @Column({ default: IsActiveEnum.WAITING })
  @AutoMap()
  isActive: string;

  @ManyToMany(() => FoodEntity, (food) => food.foodGroups, {
    cascade: ['insert', 'update'],
  })
  @JoinTable({ name: 'food_group_item' })
  foods: FoodEntity[];
}
