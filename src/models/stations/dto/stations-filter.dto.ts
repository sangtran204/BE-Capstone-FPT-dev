import { ApiProperty } from '@nestjs/swagger';
import { InActiveEnum } from 'src/common/enums/active.enum';

export class StationStatusFilter {
  @ApiProperty({
    enum: InActiveEnum,
    description: 'Station status',
    required: false,
    default: InActiveEnum.ACTIVE,
  })
  status: InActiveEnum;
}

export class StationByKitchenId {
  @ApiProperty()
  kitchenId: string;
}
