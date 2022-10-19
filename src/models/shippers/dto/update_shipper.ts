import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { BaseDTO } from 'src/models/base/base.dto';

export class UpdateShipperDTO extends BaseDTO {
  @ApiProperty()
  fullName: string;

  @ApiProperty({
    type: Date,
    description: 'dateOfBirth',
    default: new Date().toISOString().slice(0, 10),
  })
  public DOB: Date;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  noPlate: string;

  @ApiProperty()
  vehicleType: string;
}
