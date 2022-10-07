import { AutoMap } from '@automapper/classes';
import { BaseDTO } from 'src/models/base/base.dto';

export class PackageCategoryDTO extends BaseDTO {
  @AutoMap()
  name: string;

  @AutoMap()
  image: string;
}
