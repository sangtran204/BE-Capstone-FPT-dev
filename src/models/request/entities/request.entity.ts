import { AutoMap } from '@automapper/classes';
import { ReqStatusEnum } from 'src/common/enums/request.enum';
import { BaseEntity } from 'src/models/base/base.entity';
import { KitchenEntity } from 'src/models/kitchens/entities/kitchens.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'request' })
export class RequestEntity extends BaseEntity {
  @Column()
  @AutoMap()
  reason: string;

  @Column()
  @AutoMap()
  numberReq: number;

  @Column({ nullable: true })
  @AutoMap()
  rejectReason: string;

  @Column({ default: ReqStatusEnum.WAITING })
  @AutoMap()
  status: string;

  @AutoMap(() => KitchenEntity)
  @ManyToOne(() => KitchenEntity, (kitchen) => kitchen.request)
  kitchen: KitchenEntity;
}
