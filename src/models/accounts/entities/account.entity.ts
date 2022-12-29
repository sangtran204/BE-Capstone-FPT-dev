import { AutoMap } from '@automapper/classes';
import { AccountStatusEnum } from 'src/common/enums/accountStatus.enum';
import { BaseEntity } from 'src/models/base/base.entity';
import { KitchenEntity } from 'src/models/kitchens/entities/kitchens.entity';
import { NotificationEntity } from 'src/models/notifications/entities/notification.entity';
import { ProfileEntity } from 'src/models/profiles/entities/profile.entity';
import { RoleEntity } from 'src/models/roles/entities/role.entity';
import { ShipperEntity } from 'src/models/shippers/entities/shipper.entity';
import { SubscriptionEntity } from 'src/models/subscriptions/entities/subscription.entity';
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';

@Entity({ name: 'accounts' })
export class AccountEntity extends BaseEntity {
  @Column({ unique: true })
  @AutoMap()
  phone: string;

  @Column()
  @AutoMap()
  password: string;

  @Column({ default: AccountStatusEnum.ACTIVE })
  @AutoMap()
  status: string;

  @Column({ nullable: true })
  @AutoMap()
  refreshToken: string;

  @Column({ nullable: true })
  @AutoMap()
  deviceToken: string;

  @AutoMap(() => ShipperEntity)
  @OneToOne(() => ShipperEntity, (shipper) => shipper.account, {
    onDelete: 'CASCADE',
  })
  shipper: ShipperEntity;

  @AutoMap(() => KitchenEntity)
  @OneToOne(() => KitchenEntity, (kitchen) => kitchen.account, {
    onDelete: 'CASCADE',
  })
  kitchen: KitchenEntity;

  @AutoMap(() => RoleEntity)
  @ManyToOne(() => RoleEntity, (role) => role.accounts)
  role: RoleEntity;

  @OneToOne(() => ProfileEntity, (profile) => profile.account)
  @AutoMap(() => ProfileEntity)
  profile: ProfileEntity;

  @OneToMany(() => NotificationEntity, (notification) => notification.account)
  notifications: NotificationEntity[];

  @OneToMany(() => SubscriptionEntity, (subscription) => subscription.account)
  subscriptions: SubscriptionEntity[];
}
