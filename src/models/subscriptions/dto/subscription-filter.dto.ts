import { ApiProperty } from '@nestjs/swagger';
import { SubEnum } from 'src/common/enums/sub.enum';

export class SubscriptionFilter {
  @ApiProperty({
    enum: SubEnum,
    required: false,
    description: 'Subscription status',
    default: SubEnum.INPROGRESS,
  })
  status: SubEnum;
}
