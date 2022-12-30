import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty } from 'class-validator';

export class SubHistoryDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  totalPrice: number;

  @ApiProperty()
  subscriptionDate: Date;

  @ApiProperty()
  @IsEmpty()
  cancelDate: Date;

  @ApiProperty()
  status: string;

  @ApiProperty()
  packageName: string;

  @ApiProperty()
  packageImg: string;
}
