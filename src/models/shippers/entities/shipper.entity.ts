import { AutoMap } from '@automapper/classes';
import { StatusEnum } from 'src/common/enums/status.enum';
import { AccountEntity } from 'src/models/accounts/entities/account.entity';
import { BaseEntity } from 'src/models/base/base.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'shippers' })
export class ShipperEntity extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  @AutoMap()
  noPlate: string;

  @Column()
  @AutoMap()
  vehicleType: string;

  @Column({ default: StatusEnum.WAITING })
  @AutoMap()
  status: string;

  @AutoMap(() => AccountEntity)
  @OneToOne(() => AccountEntity, (account) => account.shipper, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id' })
  account: AccountEntity;
}
