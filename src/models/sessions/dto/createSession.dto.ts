import { ApiProperty } from '@nestjs/swagger';

export class CreateSessionDTO {
  @ApiProperty()
  workDate: Date;

  @ApiProperty()
  kitchenId: string;

  @ApiProperty()
  timeSlotId: string;
}
