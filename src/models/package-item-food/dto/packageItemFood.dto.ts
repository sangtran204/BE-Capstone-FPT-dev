import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from 'src/models/base/base.dto';

export class PackageItemFoodDTO extends BaseDTO {
  @ApiProperty()
  @AutoMap()
  maxFood: number;
}
