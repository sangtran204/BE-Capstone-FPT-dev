import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from '../../base/base.dto';

export class ShipperDTO extends BaseDTO {
  @ApiProperty()
  @AutoMap()
  fullName: string;

  @ApiProperty()
  @AutoMap()
  phone: string;

  @ApiProperty()
  @AutoMap()
  email: string;

  @ApiProperty()
  @AutoMap()
  address: string;

  @ApiProperty()
  @AutoMap()
  gender: boolean;

  @ApiProperty()
  @AutoMap()
  dob: string;

  @ApiProperty()
  @AutoMap()
  avatar: string;
}
