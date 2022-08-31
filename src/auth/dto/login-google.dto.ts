import { ApiProperty } from '@nestjs/swagger';

export class LoginGoogleDto {
  @ApiProperty()
  access_token: string;
  @ApiProperty()
  refresh_token: string;
  @ApiProperty()
  message: string;
}
