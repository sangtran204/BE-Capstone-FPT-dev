import { ApiProperty } from '@nestjs/swagger';

export class RegisterCustomerDto {
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty({
    type: Date,
    description: 'dateOfBirth',
    default: new Date().toISOString().slice(0, 10),
  })
  public DOB: Date;
  @ApiProperty()
  gender: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  address: string;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  avatar: string;
}
