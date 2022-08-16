import { AutoMap } from '@automapper/classes';
import { IsActiveEnum } from 'src/common/enums/isActive.enum';
import { BaseEntity } from 'src/models/base/base.entity';
import { RoleEntity } from 'src/models/roles/entities/role.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'accounts' })
export class AccountEntity extends BaseEntity {
  @Column({ unique: true })
  @AutoMap()
  username: string;

  @Column()
  @AutoMap()
  password: string;

  @Column({ default: IsActiveEnum.IN_ACTIVE })
  @AutoMap()
  isActive: string;

  @Column({ nullable: true })
  @AutoMap()
  refreshToken: string;

  @Column({ nullable: true })
  @AutoMap()
  deviceToken: string;

  @ManyToOne(() => RoleEntity, (role) => role.accounts)
  role: RoleEntity;
}
