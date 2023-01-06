import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class UpdateStatusTrip {
  @ApiProperty()
  deliveryTripId: string;

  @ApiProperty()
  updateTime: string;
}

export class DirectShipperDTO {
  @ApiProperty()
  deliveryTripId: string;

  @ApiProperty()
  shipperId: string;
}
