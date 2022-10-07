import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/models/base/base.entity';
import { PackageEntity } from 'src/models/packages/entities/packages.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'package_categories' })
export class PackageCategoryEntity extends BaseEntity {
  @Column()
  @AutoMap()
  name: string;

  @Column()
  @AutoMap()
  image: string;

  @AutoMap(() => PackageEntity)
  @OneToMany(() => PackageEntity, (packages) => packages.packageCategory)
  packages: PackageEntity[];
}
