import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class OrderCreationDTO {
  @ApiProperty({ default: new Date().toISOString().slice(0, 10) })
  deliveryDate: Date;

  @ApiProperty()
  priceFood: number;

  @ApiProperty()
  nameFood: string;

  @ApiProperty()
  subscriptionID: string;

  @ApiProperty()
  packageItemID: string;

  @ApiProperty()
  foodID: string;

  @ApiProperty()
  stationID: string;

  @ApiProperty()
  timeSlotID: string;
}
