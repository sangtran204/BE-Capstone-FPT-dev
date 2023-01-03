import { ApiProperty } from '@nestjs/swagger';
import { SessionEnum } from 'src/common/enums/session.enum';

export class SessionFilterDTO {
  @ApiProperty()
  kitchenId: string;

  @ApiProperty({ default: new Date().toISOString().slice(0, 10) })
  workDate: Date;

  @ApiProperty({
    enum: SessionEnum,
    default: SessionEnum.WAITING,
    required: false,
    description: 'Session status',
  })
  status: SessionEnum;
}

export class SessionByDate {
  @ApiProperty({ default: new Date().toISOString().slice(0, 10) })
  workDate: Date;
}

export class KitchenFilterSession {
  @ApiProperty()
  timeSlotId: string;

  @ApiProperty({ default: new Date().toISOString().slice(0, 10) })
  workDate: Date;
}
