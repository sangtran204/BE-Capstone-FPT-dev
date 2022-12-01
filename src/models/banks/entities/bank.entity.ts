import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../base/base.entity';
import { AutoMap } from '@automapper/classes';
import { PaymentEntity } from 'src/models/payment/entities/payment.entity';

@Entity('banks')
export class BankEntity extends BaseEntity {
  @Column()
  @AutoMap()
  name: string;

  @Column()
  @AutoMap()
  bankCode: string;

  @OneToMany(() => PaymentEntity, (payment) => payment.bank)
  payments: PaymentEntity[];
}
