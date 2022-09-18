import { AutoMap } from '@automapper/classes';
import { IsActiveEnum } from 'src/common/enums/isActive.enum';
import { BaseEntity } from 'src/models/base/base.entity';
import { FoodCategoryEntity } from 'src/models/food-categories/entities/food-categories.entity';
import { FoodGroupItemEntity } from 'src/models/food-group-item/entities/food-group-item.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

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
  price: number;

  @Column()
  @AutoMap()
  image: string;

  @Column({ default: IsActiveEnum.ACTIVE })
  @AutoMap()
  isActive: string;

  @AutoMap(() => FoodCategoryEntity)
  @ManyToOne(() => FoodCategoryEntity, (foodCategory) => foodCategory.foods)
  foodCategory: FoodCategoryEntity;

  @AutoMap(() => FoodGroupItemEntity)
  @OneToMany(() => FoodGroupItemEntity, (food) => food.food)
  foodGroupItem: FoodGroupItemEntity[];
}
