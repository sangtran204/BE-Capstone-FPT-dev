import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/models/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'categories' })
export class CategoryEntity extends BaseEntity {
  @Column()
  @AutoMap()
  name: string;

  //   @OneToMany(() => FoodEntity, (food) => food.foodCategory)
  //   foods: FoodEntity[];
}
