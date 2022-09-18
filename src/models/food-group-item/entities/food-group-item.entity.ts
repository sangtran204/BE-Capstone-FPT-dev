import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/models/base/base.entity';
import { FoodGroupEntity } from 'src/models/food-group/entities/food-group.entity';
import { FoodEntity } from 'src/models/foods/entities/foods.entity';
import { Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'food_group_item' })
export class FoodGroupItemEntity extends BaseEntity {
  @AutoMap(() => FoodEntity)
  @ManyToOne(() => FoodEntity, (food) => food.foodGroupItem)
  food: FoodEntity;

  @AutoMap(() => FoodGroupEntity)
  @ManyToOne(() => FoodGroupEntity, (foodGroup) => foodGroup.foodGroupItem)
  foodGroup: FoodEntity;
}
