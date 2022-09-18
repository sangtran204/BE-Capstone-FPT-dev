import { AutoMap } from '@automapper/classes';
import { IsInt } from 'class-validator';
import { IsActiveEnum } from 'src/common/enums/isActive.enum';
import { BaseEntity } from 'src/models/base/base.entity';
import { PackageItemEntity } from 'src/models/package-item/entities/packageItem.entity';
import { StationPackageItemEntity } from 'src/models/stationPackageItem/entiies/stationPackageItem.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'packages' })
export class PackageEntity extends BaseEntity {
  @Column()
  @AutoMap()
  startSale: string;

  @Column()
  @AutoMap()
  endSale: string;

  @Column()
  @AutoMap()
  name: string;

  @Column()
  @AutoMap()
  description: string;

  @Column()
  @AutoMap()
  @IsInt()
  price: number;

  @Column()
  @AutoMap()
  @IsInt()
  totalDate: number;

  @Column()
  @AutoMap()
  @IsInt()
  totalFood: number;

  @Column()
  @AutoMap()
  @IsInt()
  totalMeal: number;

  @Column()
  @AutoMap()
  @IsInt()
  totalStation: number;

  @Column({ default: IsActiveEnum.WAITING })
  @AutoMap()
  isActive: string;

  @OneToMany(
    () => StationPackageItemEntity,
    (stationPackageItem) => stationPackageItem.packagess,
  )
  stationPackageItems: StationPackageItemEntity[];

  @OneToMany(() => PackageItemEntity, (packageItems) => packageItems.packages)
  packageItem: PackageItemEntity[];
}
