import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/models/base/base.entity';
import { CustomerEntity } from 'src/models/customers/entities/customer.entity';
import { PackageEntity } from 'src/models/packages/entities/packages.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'feedback' })
export class FeedBackEntity extends BaseEntity {
  @Column()
  @AutoMap()
  title: string;

  @Column()
  @AutoMap()
  content: string;

  @Column()
  @AutoMap()
  rating: number;

  @AutoMap(() => CustomerEntity)
  @ManyToOne(() => CustomerEntity, (customer) => customer.feedback)
  customer: CustomerEntity;

  @AutoMap(() => PackageEntity)
  @ManyToOne(() => PackageEntity, (packages) => packages.feedback)
  packages: PackageEntity;
}
