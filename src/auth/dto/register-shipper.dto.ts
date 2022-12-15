import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class RegisterShipperDTO {
  @ApiProperty()
  phone: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty({
    type: Date,
    description: 'dateOfBirth',
    default: new Date().toISOString().slice(0, 10),
  })
  DOB: Date;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  noPlate: string;

  @ApiProperty()
  vehicleType: string;
}
