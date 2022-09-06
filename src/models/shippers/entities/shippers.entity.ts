import { AutoMap } from '@automapper/classes';
import { IsActiveEnum } from 'src/common/enums/isActive.enum';
import { BaseEntity } from 'src/models/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'shippers' })
export class ShipperEntity extends BaseEntity {
  @Column()
  @AutoMap()
  fullName: string;

  @Column()
  @AutoMap()
  address: string;

  @Column()
  @AutoMap()
  phone: string;

  @Column()
  @AutoMap()
  email: string;

  @Column()
  @AutoMap()
  gender: boolean;

  @Column()
  @AutoMap()
  dob: Date;

  @Column()
  @AutoMap()
  avatar: string;

  @Column({ default: IsActiveEnum.ACTIVE })
  @AutoMap()
  isActive: string;
}
