import { ApiProperty } from '@nestjs/swagger';
import { OrderEnum } from 'src/common/enums/order.enum';
import { BaseFilter } from 'src/models/base/base.filter';

export class OrderFilter extends BaseFilter {
  @ApiProperty({
    type: Date,
    description: 'Start Date Search',
    required: false,
    default: new Date(),
  })
  startDate: Date;

  @ApiProperty({
    type: String,
    description: 'End Date Search',
    required: false,
    default: new Date(),
  })
  endDate: Date;
}

export class OrderFilterMe extends BaseFilter {
  @ApiProperty({
    enum: OrderEnum,
    description: 'Sort Ascending or Descending by ',
    required: false,
    default: OrderEnum.PENDING,
  })
  status: OrderEnum;
}

export class OrderSearchByDate {
  @ApiProperty({ default: new Date().toISOString().slice(0, 10) })
  deliveryDate: Date;
}
