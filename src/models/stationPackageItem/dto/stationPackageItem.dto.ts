import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from '../../base/base.dto';

export class StationPackageItemDTO extends BaseDTO {
  @ApiProperty()
  @AutoMap()
  packageId: string;

  @ApiProperty()
  @AutoMap()
  stationId: string;
}
