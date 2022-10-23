import { ApiProperty } from '@nestjs/swagger';
// import { BaseDTO } from 'src/models/base/base.dto';
export class UpdateProfileDTO {
  @ApiProperty()
  fullName: string;

  @ApiProperty()
  DOB: Date;

  @ApiProperty({ type: String, format: 'binary' })
  avatar: object;

  @ApiProperty()
  email: string;
}
