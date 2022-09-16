import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/models/base/base.entity';
import { PackageEntity } from 'src/models/packages/entities/packages.entity';
import { StationEntity } from 'src/models/stations/entities/stations.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'station_package_item' })
export class StationPackageItemEntity extends BaseEntity {
  @AutoMap(() => StationEntity)
  @ManyToOne(() => StationEntity, (station) => station.stationPackageItems)
  station: StationEntity;

  @AutoMap(() => PackageEntity)
  @ManyToOne(() => PackageEntity, (packages) => packages.stationPackageItems)
  packagess: PackageEntity;
}
