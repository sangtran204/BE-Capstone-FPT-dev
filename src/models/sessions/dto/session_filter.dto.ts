import { ApiProperty } from '@nestjs/swagger';
import { SessionEnum } from 'src/common/enums/session.enum';

export class SessionFilterDTO {
  @ApiProperty()
  kitchenId: string;

  @ApiProperty({ default: new Date().toISOString().slice(0, 10) })
  deliveryDate: Date;

  @ApiProperty({
    enum: SessionEnum,
    default: SessionEnum.WAITING,
    required: false,
    description: 'Session status',
  })
  status: SessionEnum;
}
