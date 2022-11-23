import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateDeliveryTripDTO {
  @ApiProperty()
  shipperId: string;

  @ApiProperty()
  stationId: string;

  @ApiProperty()
  timeSlotId: string;

  @ApiProperty()
  deliveryDate: Date;

  @ApiProperty({ type: [String] })
  @IsUUID(null, { each: true, message: 'ID food must be unique' })
  ordersIds: string[];
}
