import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../base/base.entity';
import { AccountEntity } from '../../accounts/entities/account.entity';
import { AutoMap } from '@automapper/classes';
import { StatusEnum } from 'src/common/enums/status.enum';

@Entity('notifications')
export class NotificationEntity extends BaseEntity {
  @Column()
  @AutoMap()
  title: string;

  @Column()
  @AutoMap()
  body: string;

  @Column()
  @AutoMap()
  data: string;

  @Column({ default: StatusEnum.NOT_SEEN })
  @AutoMap()
  status: string;

  @Column()
  @AutoMap()
  type: string;

  @ManyToOne(() => AccountEntity, (account) => account.notifications)
  account: AccountEntity;
}
