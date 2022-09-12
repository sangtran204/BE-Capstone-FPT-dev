import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { StationDTO } from 'src/models/stations/dto/stations.dto';
import { BaseDTO } from '../../base/base.dto';

export class DeliveryTripDTO extends BaseDTO {
  @ApiProperty()
  @AutoMap()
  isActive: string;

  @AutoMap(() => StationDTO)
  station: StationDTO;
}
