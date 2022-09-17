import { AutoMap } from '@automapper/classes';
import { IsInt } from 'class-validator';
import { BaseEntity } from 'src/models/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'package_item_food' })
export class PackageItemFoodEntity extends BaseEntity {
  @Column()
  @AutoMap()
  @IsInt()
  maxFood: number;
}
