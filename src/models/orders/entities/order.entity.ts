import { AutoMap } from '@automapper/classes';
import { StatusEnum } from 'src/common/enums/status.enum';
import { BaseEntity } from 'src/models/base/base.entity';
import { CustomerEntity } from 'src/models/customers/entities/customer.entity';
import { PackageEntity } from 'src/models/packages/entities/packages.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'orders' })
export class OrderEntity extends BaseEntity {
  @Column()
  @AutoMap()
  totalPrice: number;

  @Column('date')
  @AutoMap()
  startDelivery: Date;

  // @Column('date')
  // @AutoMap()
  // endDelivery: Date;

  @Column('date', { nullable: true })
  @AutoMap()
  cancelDate: Date;

  @Column({ default: StatusEnum.UNCONFIRMED })
  @AutoMap()
  status: string;

  @ManyToOne(() => CustomerEntity, (customer) => customer.orders, {
    nullable: false,
  })
  @AutoMap(() => CustomerEntity)
  customer: CustomerEntity;

  @ManyToOne(() => PackageEntity, (packages) => packages.orders, {
    nullable: false,
  })
  @AutoMap(() => PackageEntity)
  packages: PackageEntity;

  // @OneToMany(() => PaymentEntity, (payment) => payment.order)
  // payment: PaymentEntity;
}
