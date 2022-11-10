import { AutoMap } from '@automapper/classes';
import { BaseDTO } from '../../base/base.dto';
export class FeedBackDTO extends BaseDTO {
  @AutoMap()
  title: string;

  @AutoMap()
  content: string;

  @AutoMap()
  rating: number;
}
