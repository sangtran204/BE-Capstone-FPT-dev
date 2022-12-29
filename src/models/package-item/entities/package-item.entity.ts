import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/models/base/base.entity';
import { FoodGroupEntity } from 'src/models/food-group/entities/food-group.entity';
import { OrderEntity } from 'src/models/orders/entities/order.entity';
import { PackageEntity } from 'src/models/packages/entities/packages.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'package_item' })
export class PackageItemEntity extends BaseEntity {
  @Column('date')
  @AutoMap()
  deliveryDate: Date;

  @Column()
  @AutoMap()
  itemCode: number;

  @AutoMap(() => FoodGroupEntity)
  @ManyToOne(() => FoodGroupEntity, (foodGroup) => foodGroup.packageItem)
  foodGroup: FoodGroupEntity;

  @AutoMap(() => PackageEntity)
  @ManyToOne(() => PackageEntity, (packages) => packages.packageItem)
  packages: PackageEntity;

  @AutoMap(() => [OrderEntity])
  @OneToMany(() => OrderEntity, (order) => order.packageItem)
  orders: OrderEntity[];
}
