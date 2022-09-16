import { AutoMap } from '@automapper/classes';
import { IsActiveEnum } from 'src/common/enums/isActive.enum';
import { BaseEntity } from 'src/models/base/base.entity';
import { FoodCategoryEntity } from 'src/models/food-categories/entities/food-categories.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

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
}
