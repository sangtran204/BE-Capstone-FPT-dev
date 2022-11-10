import { SubscriptionEntity } from 'src/models/subscriptions/entities/subscription.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { BaseEntity } from '../../base/base.entity';
// import { BankEntity } from '../../banks/entities/bank.entity';
import { OrderEntity } from '../../orders/entities/order.entity';

@Entity('payments')
export class PaymentEntity extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  amount: number;

  //   @Column('varchar', { name: 'BankTranNo', nullable: false })
  //   bankTranNo: string;

  @Column('varchar', { name: 'CardType', nullable: false })
  cardType: string;

  @Column('varchar', { name: 'OrderInfo', nullable: false })
  orderInfo: string;

  @Column('varchar', { name: 'PayDate', nullable: false })
  payDate: string;

  @Column('varchar', { name: 'TransactionNo', nullable: false })
  transactionNo: string;

  @Column('varchar', { name: 'TransactionStatus', nullable: false })
  transactionStatus: string;

  //   @ManyToOne(() => BankEntity, (bank) => bank.payments)
  //   @JoinColumn({ name: 'bankId' })
  //   bank: BankEntity;

  @OneToOne(() => SubscriptionEntity, (subscription) => subscription.payment)
  @JoinColumn({ name: 'id' })
  subscription: SubscriptionEntity;
}
