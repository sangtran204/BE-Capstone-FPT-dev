import { ApiProperty } from '@nestjs/swagger';
import { DeliveryTripEnum } from 'src/common/enums/deliveryTrip.enum';

export class TripFilter {
  @ApiProperty({
    enum: DeliveryTripEnum,
    default: DeliveryTripEnum.WAITING,
    required: false,
    description: 'Delivery trip status',
  })
  status: DeliveryTripEnum;
}
