import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/models/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'foods' })
export class FoodEntity extends BaseEntity {
  @Column()
  @AutoMap()
  name: string;

  @Column()
  @AutoMap()
  description: string;

  @Column()
  @AutoMap()
  img: string;

  //   @OneToMany(() => FoodEntity, (food) => food.foodCategory)
  //   foods: FoodEntity[];
}
