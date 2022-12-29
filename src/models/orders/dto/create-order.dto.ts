import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class OrderCreationDTO {
  @ApiProperty()
  subscriptionID: string;

  @ApiProperty()
  packageItemID: string;

  @ApiProperty()
  timeSlotID: string;

  @ApiProperty()
  stationID: string;
}
