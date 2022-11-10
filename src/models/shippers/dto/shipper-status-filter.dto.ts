import { ApiProperty } from '@nestjs/swagger';
import { ShipperStatusEnum } from 'src/common/enums/shipperStatus.enum';

export class ShipperStatusFilter {
  @ApiProperty({
    enum: ShipperStatusEnum,
    required: false,
    description: 'Shipper status',
    default: ShipperStatusEnum.ACTIVE,
  })
  status: ShipperStatusEnum;
}
