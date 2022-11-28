import { ApiProperty } from '@nestjs/swagger';
import { AccountStatusEnum } from 'src/common/enums/accountStatus.enum';

export class KitchenFilterDTO {
  @ApiProperty({
    enum: AccountStatusEnum,
    required: false,
    description: 'Account status',
    default: AccountStatusEnum.ACTIVE,
  })
  status: AccountStatusEnum;
}
