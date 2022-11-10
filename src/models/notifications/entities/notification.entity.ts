import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../base/base.entity';
import { AccountEntity } from '../../accounts/entities/account.entity';
import { AutoMap } from '@automapper/classes';
import { TypeNotificationEnum } from 'src/common/enums/notification.enum';

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

  @Column({ default: TypeNotificationEnum.NOT_SEEN })
  @AutoMap()
  status: string;

  @Column()
  @AutoMap()
  type: string;

  @ManyToOne(() => AccountEntity, (account) => account.notifications)
  account: AccountEntity;
}
