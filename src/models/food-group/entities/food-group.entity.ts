import { AutoMap } from '@automapper/classes';
import { IsActiveEnum } from 'src/common/enums/isActive.enum';
import { BaseEntity } from 'src/models/base/base.entity';
import { FoodGroupItemEntity } from 'src/models/food-group-item/entities/food-group-item.entity';
import { PackageItemFoodEntity } from 'src/models/package-item-food/entities/package-item-food.entity';
import { Column, Entity, OneToMany } from 'typeorm';

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

  @AutoMap(() => FoodGroupItemEntity)
  @OneToMany(() => FoodGroupItemEntity, (foodGroup) => foodGroup.foodGroup)
  foodGroupItem: FoodGroupItemEntity[];

  @AutoMap(() => PackageItemFoodEntity)
  @OneToMany(() => PackageItemFoodEntity, (foodGroup) => foodGroup.foodGroup)
  packageItemFood: PackageItemFoodEntity[];
}
