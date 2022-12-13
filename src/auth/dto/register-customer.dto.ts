import { ApiProperty } from '@nestjs/swagger';

export class RegisterCustomerDTO {
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
  email: string;

  @ApiProperty({ default: 'Default address' })
  address: string;
}
