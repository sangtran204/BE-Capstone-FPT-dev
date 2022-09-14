import { AutoMap } from '@automapper/classes';
import { IsInt, IsNotEmpty } from 'class-validator';
import { IsActiveEnum } from 'src/common/enums/isActive.enum';
import { BaseEntity } from 'src/models/base/base.entity';
import { HasFoodGroupEntity } from 'src/models/hasFoodGroup/entities/hasFoodGroup.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'foodgroups' })
export class FoodGroupEntity extends BaseEntity {
  @Column()
  @AutoMap()
  @IsNotEmpty()
  name: string;

  @Column()
  @AutoMap()
  @IsNotEmpty()
  description: string;

  @Column()
  @AutoMap()
  img: string;

  @Column({ default: IsActiveEnum.WAITING })
  @AutoMap()
  @IsNotEmpty()
  isActive: string;

  @Column()
  @AutoMap()
  @IsNotEmpty()
  @IsInt()
  totalFood: number;

  @OneToMany(() => HasFoodGroupEntity, (group) => group.hasGroup)
  hasFoodGroup: HasFoodGroupEntity[];
}
