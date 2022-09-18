import { AutoMap } from '@automapper/classes';
import { IsInt } from 'class-validator';
import { BaseEntity } from 'src/models/base/base.entity';
import { FoodGroupEntity } from 'src/models/food-group/entities/food-group.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'package_item_food' })
export class PackageItemFoodEntity extends BaseEntity {
  @Column()
  @AutoMap()
  @IsInt()
  maxFood: number;

  @AutoMap(() => FoodGroupEntity)
  @ManyToOne(() => FoodGroupEntity, (foodGroup) => foodGroup.packageItemFood)
  foodGroup: FoodGroupEntity;
}
