import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class OrderCreationDTO {
  @ApiProperty({ default: new Date().toISOString().slice(0, 10) })
  deliveryDate: Date;

  @ApiProperty()
  deliveryTime: Date;

  @ApiProperty()
  priceFood: number;

  @ApiProperty()
  nameFood: string;

  @ApiProperty()
  @IsUUID()
  subscriptionID: string;

  @ApiProperty()
  @IsUUID()
  packageItemID: string;

  @ApiProperty()
  @IsUUID()
  foodID: string;

  @ApiProperty()
  @IsUUID()
  stationID: string;
}
