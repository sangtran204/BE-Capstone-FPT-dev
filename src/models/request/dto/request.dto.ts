import { AutoMap } from '@automapper/classes';
import { BaseDTO } from 'src/models/base/base.dto';
import { KitchenDTO } from 'src/models/kitchens/dto/kitchen.dto';

export class RequestDTO extends BaseDTO {
  @AutoMap()
  reason: string;

  @AutoMap()
  numberReq: number;

  @AutoMap()
  status: string;

  @AutoMap(() => KitchenDTO)
  kitchen: KitchenDTO;
}
