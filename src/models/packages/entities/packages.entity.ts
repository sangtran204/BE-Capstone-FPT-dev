import { AutoMap } from '@automapper/classes';
import { IsActiveEnum } from 'src/common/enums/isActive.enum';
import { BaseEntity } from 'src/models/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'packages' })
export class PackageEntity extends BaseEntity {
  @Column()
  @AutoMap()
  name: string;

  @Column()
  @AutoMap()
  description: string;

  @Column()
  @AutoMap()
  totalGroupItem: number;

  @Column()
  @AutoMap()
  price: number;

  @Column({ default: IsActiveEnum.WAITING })
  @AutoMap()
  isActive: string;
}
