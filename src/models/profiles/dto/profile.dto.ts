import { AutoMap } from '@automapper/classes';
// import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from 'src/models/base/base.dto';
export class ProfileDTO extends BaseDTO {
  @AutoMap()
  fullName: string;

  @AutoMap()
  DOB: Date;

  @AutoMap()
  avatar: string;

  @AutoMap()
  email: string;
}
