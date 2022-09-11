import { AutoMap } from '@automapper/classes';
import { IsActiveEnum } from 'src/common/enums/isActive.enum';
import { BaseEntity } from 'src/models/base/base.entity';
import { FoodCategoryEntity } from 'src/models/food-categories/entities/food-categories.entity';
import { ImageEntity } from 'src/models/images/entities/images.entity';
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

  @Column({ default: IsActiveEnum.ACTIVE })
  @AutoMap()
  isActive: string;

  @AutoMap(() => FoodCategoryEntity)
  @ManyToOne(() => FoodCategoryEntity, (foodCategory) => foodCategory.foods)
  foodCategory: FoodCategoryEntity;

  @AutoMap(() => [ImageEntity])
  @OneToMany(() => ImageEntity, (image) => image.food)
  images: ImageEntity[];
}
