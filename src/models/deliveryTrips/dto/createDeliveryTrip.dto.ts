import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

// export class CreateDeliveryTripDTO {
//   @ApiProperty()
//   shipperId: string;

//   // @ApiProperty()
//   // stationId: string;

//   @ApiProperty()
//   kitchenId: string;

//   @ApiProperty()
//   timeSlotId: string;

//   @ApiProperty()
//   deliveryDate: Date;

//   @ApiProperty({ type: [String] })
//   @IsUUID(null, { each: true, message: 'ID food must be unique' })
//   ordersIds: string[];
// }

export class CreateTripDTO {
  @ApiProperty()
  sessionId: string;
}

export class AssignShipperDTO {
  @ApiProperty()
  sessionId: string;

  @ApiProperty({ type: [String], required: true })
  @IsUUID(null, { each: true, message: 'ID shipper must be unique' })
  shipperIds: string[];
}
