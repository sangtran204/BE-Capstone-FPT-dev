import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class RegisterAccountDTO {
  @ApiProperty()
  phone: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  //   @ApiProperty({
  //     type: Date,
  //     description: 'dateOfBirth',
  //     default: new Date().toISOString().slice(0, 10),
  //   })
  //   public DOB: Date;
}
