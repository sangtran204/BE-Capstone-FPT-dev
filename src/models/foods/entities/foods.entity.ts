import { AutoMap } from '@automapper/classes';
import { IsActiveEnum } from 'src/common/enums/isActive.enum';
import { BaseEntity } from 'src/models/base/base.entity';
import { FoodCategoryEntity } from 'src/models/food-categories/entities/food-categories.entity';
import { FoodGroupEntity } from 'src/models/food-group/entities/food-group.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

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

  @AutoMap(() => [FoodGroupEntity])
  @ManyToMany(() => FoodGroupEntity, (foodGroup) => foodGroup.foods)
  foodGroups: FoodGroupEntity[];
}
