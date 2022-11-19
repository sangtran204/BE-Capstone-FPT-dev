import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class UpdateStatusTrip {
  @ApiProperty()
  deliveryTripId: string;

  @ApiProperty({ type: [String] })
  @IsUUID(null, { each: true, message: 'ID food must be unique' })
  ordersIds: string[];
}
