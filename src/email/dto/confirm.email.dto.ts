import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ConfirmEmailDto {
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'name' })
  name: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'email' })
  email: string;
}
