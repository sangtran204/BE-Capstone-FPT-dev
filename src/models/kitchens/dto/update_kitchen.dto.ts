import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { BaseDTO } from 'src/models/base/base.dto';

export class UpdateKitchenDTO extends BaseDTO {
  @ApiProperty()
  fullName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  address: string;
}
