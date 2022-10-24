import { ApiProperty } from '@nestjs/swagger';
export class UpdateProfileDTO {
  @ApiProperty()
  fullName: string;

  @ApiProperty({ default: new Date().toISOString().slice(0, 10) })
  DOB: Date;

  @ApiProperty()
  email: string;
}
