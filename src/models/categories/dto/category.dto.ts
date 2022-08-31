import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from '../../base/base.dto';
export class CategoryDTO extends BaseDTO {
  @ApiProperty()
  @AutoMap()
  name: string;
}
