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
  public DOB: Date;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  avatar: string;
  @ApiProperty()
  noPlate: string;
  @ApiProperty()
  vehicleType: string;
}
