import { ApiProperty } from '@nestjs/swagger';
export class LoginDto {
  @ApiProperty()
  phone: string;

  @ApiProperty()
  password: string;
}
