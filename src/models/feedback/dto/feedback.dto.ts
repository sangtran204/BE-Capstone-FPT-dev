import { AutoMap } from '@automapper/classes';
import { SubscriptionDTO } from 'src/models/subscriptions/dto/subscription.dto';
import { BaseDTO } from '../../base/base.dto';
export class FeedBackDTO extends BaseDTO {
  @AutoMap()
  packageRate: number;

  // @Column()
  // @AutoMap()
  // foodRate: number;

  @AutoMap()
  deliveryRate: number;

  @AutoMap()
  comment: string;

  @AutoMap(() => SubscriptionDTO)
  subscription: SubscriptionDTO;
}
