import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from 'src/models/base/base.dto';

export class HasFoodGroupDTO extends BaseDTO {
  @ApiProperty()
  @AutoMap()
  hasGroupId: string;

  @ApiProperty()
  @AutoMap()
  packageId: string;
}
