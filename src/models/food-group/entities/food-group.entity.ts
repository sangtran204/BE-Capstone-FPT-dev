import { AutoMap } from '@automapper/classes';
import { FoodGroupEnum } from 'src/common/enums/food-group.enum';
import { BaseEntity } from 'src/models/base/base.entity';
import { FoodEntity } from 'src/models/foods/entities/foods.entity';
import { PackageItemEntity } from 'src/models/package-item/entities/package-item.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

@Entity({ name: 'food_groups' })
export class FoodGroupEntity extends BaseEntity {
  @Column()
  @AutoMap()
  name: string;

  @Column()
  @AutoMap()
  description: string;

  @Column({ default: FoodGroupEnum.ACTIVE })
  @AutoMap()
  status: string;

  @AutoMap(() => [FoodEntity])
  @ManyToMany(() => FoodEntity, (food) => food.foodGroups)
  @JoinTable({ name: 'food_group_item' })
  foods: FoodEntity[];

  @OneToMany(() => PackageItemEntity, (packageItems) => packageItems.foodGroup)
  packageItem: PackageItemEntity[];
}
