import { ApiProperty } from '@nestjs/swagger';

export class CreateStationDTO {
  @ApiProperty()
  kitchenId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  openTime: Date;

  @ApiProperty()
  closeTime: Date;
}
