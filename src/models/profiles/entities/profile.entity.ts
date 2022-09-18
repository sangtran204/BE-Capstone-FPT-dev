import { AutoMap } from '@automapper/classes';
import { GenderEnum } from 'src/common/enums/gender.enum';
import { AccountEntity } from 'src/models/accounts/entities/account.entity';
import { BaseEntity } from 'src/models/base/base.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'profiles' })
export class ProfileEntity extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  @AutoMap()
  fullName: string;

  @Column()
  @AutoMap()
  email: string;

  @Column()
  @AutoMap()
  DOB: Date;

  @Column({ default: GenderEnum.MALE })
  @AutoMap()
  gender: string;

  @Column()
  @AutoMap()
  address: string;

  @Column({ nullable: true })
  @AutoMap()
  avatar: string;

  @Column()
  @AutoMap()
  phone: string;

  @OneToOne(() => AccountEntity, (account) => account)
  @JoinColumn({ name: 'id' })
  account: AccountEntity;
}
