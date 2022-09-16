import { BaseEntity } from 'src/models/base/base.entity';
import { FoodGroupEntity } from 'src/models/foodGroups/entities/foodGroups.entity';
import { PackageEntity } from 'src/models/packages/entities/packages.entity';
import { Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'has_food_group' })
export class HasFoodGroupEntity extends BaseEntity {
  @ManyToOne(() => FoodGroupEntity, (group) => group.hasFoodGroup)
  hasGroup: HasFoodGroupEntity;

  @ManyToOne(() => PackageEntity, (packages) => packages.hasFoodGroup)
  package: PackageEntity;
}
