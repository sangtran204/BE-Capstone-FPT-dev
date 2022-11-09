import { ApiProperty } from '@nestjs/swagger';
import { AccountStatusEnum } from 'src/common/enums/accountStatus.enum';
import { RoleEnum } from 'src/common/enums/role.enum';

export class AccountFilterDTO {
  // @ApiProperty({ required: false })
  // phone: string;

  // @ApiProperty({
  //   enum: AccountStatusEnum,
  //   required: false,
  //   description: 'Status account',
  //   default: AccountStatusEnum.ACTIVE,
  // })
  // status: AccountStatusEnum;

  @ApiProperty({
    enum: RoleEnum,
    required: false,
    description: 'Role account',
    default: RoleEnum.ADMIN,
  })
  role: RoleEnum;
}

export class AccountStatusFilter {
  @ApiProperty({
    enum: AccountStatusEnum,
    required: false,
    description: 'Account status',
    default: AccountStatusEnum.ACTIVE,
  })
  status: AccountStatusEnum;
}
