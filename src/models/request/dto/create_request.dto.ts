import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateRequestDTO {
  @ApiProperty()
  reason: string;

  @ApiProperty()
  @IsNotEmpty()
  numberReq: number;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  kitchenId: string;
}
