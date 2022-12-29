import { ApiProperty } from '@nestjs/swagger';
import { AccountStatusEnum } from 'src/common/enums/accountStatus.enum';
import { ShipperStatusEnum } from 'src/common/enums/shipperStatus.enum';

export class ShipperStatusFilter {
  @ApiProperty()
  kitchenId: string;

  @ApiProperty({
    enum: ShipperStatusEnum,
    required: false,
    description: 'Shipper status',
    default: ShipperStatusEnum.ACTIVE,
  })
  status: ShipperStatusEnum;
}

export class ShipperFilterDTO {
  @ApiProperty({
    required: false,
    description: 'Shipper account status',
    enum: AccountStatusEnum,
    default: AccountStatusEnum.ACTIVE,
  })
  statusAcc: AccountStatusEnum;
}
