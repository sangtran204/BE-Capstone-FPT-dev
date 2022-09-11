import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from '../../base/base.dto';

export class KitchenDTO extends BaseDTO {
  @ApiProperty()
  @AutoMap()
  name: string;

  @ApiProperty()
  @AutoMap()
  address: string;

  @ApiProperty()
  @AutoMap()
  phone: string;
}
