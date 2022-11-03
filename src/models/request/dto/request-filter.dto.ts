import { ApiProperty } from '@nestjs/swagger';
import { ReqStatusEnum } from 'src/common/enums/request.enum';
import { StatusEnum } from 'src/common/enums/status.enum';

export class RequestFilterDTO {
  @ApiProperty({
    enum: ReqStatusEnum,
    required: false,
    default: ReqStatusEnum.WAITING,
    description: 'Request status',
  })
  status: ReqStatusEnum;
}
